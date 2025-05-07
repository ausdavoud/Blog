---
title: Hacking through X-Content-Type-Options
date: 2025-05-07
keywords: go, http
---

I'm been recently watching https://frontendmasters.com/courses/complete-go. While building and test a simple http server in Go, I came across this super interesting thing that I'm about to explain: 
**What is `X-Content-Type-Options: nosniff` in HTTP response headers?**

I'm not going into the details of setting up a server in Go, as it is fairly irrelevant. Just some boiler-point codes.

I''ll explain my journey and how I encountered this question at the first place.

# Where did the question come up from?
## Setting up the server
First we set up a route to do health-check for our http server
```go
http.HandleFunc("GET /health", app.HealthCheck)
```
It simply says if there is a `GET` request that matches the `/health` endpoint, you should map it to `app.HealthChecl`. 

After running the server, I used curl to check if it's really working. 

## Sending a `GET` request
```sh
$ curl -v -X GET 127.0.0.1:8081/health

Note: Unnecessary use of -X or --request, GET is already inferred.
*   Trying 127.0.0.1:8081...
* Connected to 127.0.0.1 (127.0.0.1) port 8081
> GET /health HTTP/1.1
> Host: 127.0.0.1:8081
> User-Agent: curl/8.7.1
> Accept: */*
> 
* Request completely sent off
< HTTP/1.1 200 OK
< Date: Sat, 03 May 2025 19:06:26 GMT
< Content-Length: 19
< Content-Type: text/plain; charset=utf-8
< 
Server is healthy!
* Connection #0 to host 127.0.0.1 left intact
```

Note 1: `-v` flag is telling curl to be verbose and show us the request and response headers.
Note 2: As you see, `-X GET` is unnecessary since curl defaults to GET. But there's a reason I did it this way.

Let's analyze the request:
1. It tries to reach the endpoint.
2. Connects to it
3. Sends a GET request at /health to 127.0.0.1:8081
4. ...

Let's analyze the response as well:
1. Received 200 OK
2. Received Date, Content-Length, Content-Type and Body (Server is healthy)


## Sending a `Get` (NOT `GET`) request
But what if we change the request method from GET to Get (or anything else). As Go is case-sensitive, it will reject it!
```sh
$ curl -v -X Get 127.0.0.1:8081/health
Note: Unnecessary use of -X or --request, GET is already inferred.
*   Trying 127.0.0.1:8081...
* Connected to 127.0.0.1 (127.0.0.1) port 8081
> Get /health HTTP/1.1
> Host: 127.0.0.1:8081
> User-Agent: curl/8.7.1
> Accept: */*
> 
* Request completely sent off
< HTTP/1.1 405 Method Not Allowed
< Allow: GET, HEAD
< Content-Type: text/plain; charset=utf-8
< X-Content-Type-Options: nosniff
< Date: Sat, 03 May 2025 19:06:31 GMT
< Content-Length: 19
< 
Method Not Allowed
* Connection #0 to host 127.0.0.1 left intact
```

What attracted my attention, was the differences between the two response headers. This one, as it is 405 not allowed, has 3 extra headers: (It's also funny that `Method Not Allowed` and `Server is healthy` both have 19 letters :)
```txt
HTTP/1.1 405 Method Not Allowed
Allow: GET, HEAD
X-Content-Type-Options: nosniff
```
The first two made sense to me. Go server is trying to tell the client (here being curl) that the `Get` method is not allowed, and then directly points to the allowed headers which are `GET` and `HEAD`. 

But what is `X-content-Type-Options: nosniff`? Who's sniffin'?

# Answer to the question
I asked Gemini 2.5 Pro. The answer was clear enough that I'll post some parts here:


Gemini:

1. **The Problem: MIME Type Ambiguity and Browser Heuristics**
    - At its core, HTTP relies on the `Content-Type` header (e.g., `text/html`, `image/jpeg`, `application/javascript`) sent by the server to tell the browser how to interpret the bytes received in the response body.
    - However, servers might misconfigure the `Content-Type`, omit it, or send a generic one like `application/octet-stream` or `text/plain`.
    - Historically, browsers implemented "MIME sniffing" heuristics to handle these cases. They would examine the first few bytes of the response body, looking for patterns (magic numbers or specific byte sequences) that indicate a particular file type.
        - For example, seeing `<html>` might suggest HTML.
        - Seeing `GIF89a` suggests a GIF image.
        - Seeing patterns common in JavaScript code might suggest `application/javascript`.
    - The browser would then _override_ the server-provided `Content-Type` (or lack thereof) and process the content based on its sniffed type.

2. **The Security Risk: Content Injection and XSS**
	- **Scenario:** Imagine a site lets users upload profile descriptions, intending to display them as plain text. The server stores the description and serves it with `Content-Type: text/plain`.
	- **Attack:** An attacker uploads a "description" that is actually HTML containing malicious JavaScript: `<script>/* steal cookies */</script>`.
	- **Without `nosniff`:** When another user views the attacker's profile, the server sends the malicious string with `Content-Type: text/plain`. However, the victim's browser, performing MIME sniffing, sees the `<script>` tag. It ignores the `text/plain` header, decides the content is actually HTML/script, and executes the JavaScript within the context of the victim's session on that site. This is a classic Cross-Site Scripting (XSS) attack. The attacker could steal session cookies, make requests on the user's behalf, etc.

So. Let's do a bit of experimenting to see if we can actually perform an XSS attack to our website!

Remember this?
```go
http.HandleFunc("GET /health", app.HealthCheck)
```

Now let's modify the `app.HealthCheck` so that it returns an html code instead of `Server is healthy!`

`app.HealthCheck`
```go
func (*Application) CheckHealth(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "<html><script>alert(\"oopsy-daisy!\")</script></html>")
}
```
Notice that we're returning a script tag wrapped by an html one.

Now let's open http://localhost:8081/health in browser (instead of using curl).

Here's what we see:
![[Alert.png]]
It actually ran the code!

Let's take a look at the network tab in browser developer tools:
![[Network Tab.png]]
It's clear that the content-type is sniffed and overwritten by the browser.

So how can we avoid this? You see, modern browsers are smarter these days. They don't sniff and run html (and script) codes if there's a content-type at all. So even if we set the content-type to `text/plain` or `application/octet-stream` it won't run the script. So there's no need to put the `X-Content-Type-Options: nosniff` if we explicitly set content-type. 

But what about older browsers? They are that smart, and sometimes, even if we set content-type, they will still sniff the file and perhaps overwrite the content-type. Here comes the necessity of adding `X-Content-Type-Options: nosniff`. 

As the last part of the blog post, I'd like us to add a header to response to set the content-type and see if the scripts still runs on the browser.

healthcheck function:
```go
func (*Application) CheckHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain")
	fmt.Fprint(w, "<html><script>alert(\"oopsy-daisy!\")</script></html>")
}
```

And head to http://localhost:8081/health:
![[Added content-type.png]]

As you see, the returned value is now a plain text and not a renderable html code.


yeah, done. bye. 