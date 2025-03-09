---
title: Resurrecting LMS Log (Unif) - Part 1
date: 2025-03-08
keywords: lmslog, unif, Django, Celery, Scraping
lang: en
dir: ltr
---

So, I developed an app called LMS Log (Now called **Unif**) during my first semester at university. LMS, or Learning Management System, is a website that hosts all the course materials and notifications from professors. But I’m too lazy to check it every day just to see if there’s anything new—like exercises, updated deadlines, canceled sessions, online classes, or whatever else.

I needed it automated!

That’s why I started writing one of my first Python scripts: a scraper hosted on Deta Space (RIP) that ran a cron job to check for changes on the homepage of each course (specifically its “waterfall”) and sent me a notification on Telegram. It was decent, you know—it worked! But not long after, Deta Space shut down for good.

So, I decided to rewrite it in Node.js using TypeScript. Why? Because I wanted to learn Node and TS. I worked on it in my free time, expanding it to support various actions: message editing, attachment additions, deadline modifications, and more. But it never saw the light of day.  
You might ask why—honestly, I sometimes ask myself, too :)

Over the past few months, I started using Django. And I thought: Why not build another LMS Log? I already know the ups and downs of the project, have the logic written (even if it’s in another language), and it’s a chance to dive into a technology I want to learn: Celery.

Why is Celery needed?

Well, the scraping process has several stages:

1. Loading the webpage
2. Scraping the content
3. Comparing it with the database
4. Sending a notification on Telegram
   
And guess what? We don’t want a request to take 5 seconds. Just trigger the action and let it handle the job.

Fun fact: I don’t even know what Celery actually is or how it works. I’m not even sure if my expectations for it are right!

But here’s the thing: I thought it’d make a great blog post series to build the whole project from scratch. Watching someone who knows nothing about a tech tool stumble through learning it is a fun journey for me, so I figured it might be the same for you.

Spoiler alert: I might over-explain things. And I’m not planning to limit myself with character counts for each post. I’ll write as I can—I’ll write as I enjoy. That’s the whole point.

Anyway, let’s talk about what we’re going to build and the tech stack.

I want this project to include everything I haven’t tackled in my previous projects. So, documentation, CI/CD, more Docker, and of course, _this guide_ will definitely be part of it.

Let’s list my expectations and see what we can do (using the right tech for each).

## Project Architecture
I’m not sure if that’s the right term, but I need a tool for drawing diagrams to show what’s happening inside my app—from the request coming in, to Celery, scraping, file handling, and sending a notification to Telegram. I want it in the README of the GitHub repository, keeping it clean and visible so anyone interested can quickly grasp what’s going on under the hood when they open the project.

I asked Claude 3.7 Sonnet about it, and it suggested Mermaid for diagrams.
Examples: https://mermaid.js.org/syntax/examples.html

It also mentioned django-extensions, a library packed with tools and features, including one for drawing Django models and their relationships.  
[https://django-extensions.readthedocs.io/](https://django-extensions.readthedocs.io/)

The other day, I also asked Claude 3.7 Sonnet about tools for this kind of thing, and I stumbled across something called ADR, or Architecture Decision Records.

## ADR
To give a bit of background, I recently worked on a Business Simulation project using Django. There, I had to make a ton of decisions about how things should be done. I enjoyed it—especially when I realized the database schemas were solid enough to support a feature with minimal queries and redundancy.

But soon enough, it hit me: these decisions need to be documented. They should be passed on to the next developer so they understand why a certain part of the logic works the way it does. 
I’m not sure if I’ll use it yet. But if I find a suitable tool with a nice UI—one that helps the next developer (or my baffled-by-the-app-logic self two months from now) answer the “whys”—I’ll definitely go for it.

It’s time to Google and see if there are any tools out there for this.

(a few moments later)

I found [https://github.com/adr/madr](https://github.com/adr/madr). It uses Markdown and has been updated recently. I’m going to check if there are any YouTube tutorials on it.

I found [https://www.youtube.com/watch?v=t04uboZ9Lks](https://www.youtube.com/watch?v=t04uboZ9Lks). The first 10-15 minutes should be enough. What I’ll do is add a `/docs/adr` directory and use the [madr templates](https://github.com/adr/madr/blob/develop/template/adr-template.md) to explain my decisions. I like the Pros and Cons of the Options header but not the Drivers section. So, I’ll mix their templates and create something new. Be sure to check out the `docs/adr/template.md` to see what I come up with.
## Documentations
I chatted with Claude 3.7 Sonnet about tools for documenting my Django project. It suggested Sphinx and a bunch of others, but I’m drawn to MkDocs. It’s used by FastAPI and Pydantic (and a bunch of other cool projects). I feel alive reading docs hosted on Material MkDocs (it also supports `readthedocs`).

There’s a Python package for it, so I’ll be using that. When we get to the part where we set up the project, we’ll dive into MkDocs too.

# Profiling
I first heard about profiling from [https://t.me/pyHints](https://t.me/pyHints). They also mentioned Scalene. I plan to use it to profile my application, though I’m not sure if it can profile Celery tasks to pinpoint which parts are the most resource- or time-intensive.

OK! I checked the GitHub issues, and it looks like it doesn’t actually work with Celery. I also saw Adam Johnson’s comment asking for a Scalene API that could integrate with Django Debug Toolbar.

That, my friends, brings us to the next tool: Django Debug Toolbar. It’s not really necessary for a small project like this, especially since we’re not hitting the database too much. But we can use it anyway.

## Test
There’s an awesome course by BugBytes on NetNinja’s YouTube channel covering the basics of writing tests in Python. I also have Adam Johnson’s book on boosting Django tests. We’ll write enough tests to ensure unexpected behavior doesn’t sneak in.
## Recap
- Backend: Django, obviously
- DB: PostgreSQL + Redis
- Are we gonna need `Flower`? idk.
- Task management: Celery
- Frontend: HTMX + TailwindCSS + FlyonUI + Django templates
- Package manager: UV
- CI/CD: Github Actions
- Containerization: Docker
- Deployment: Dokploy? On a VPS
- Test: Pytest
- Docs:
	- General: MkDocs
	- ADR: mard templates
	- Diagram: Mermaid
	- Model diagrams: `django-extensions`
- Env Management: `python-decouple`?
- Formatter: Ruff
- Python: 3.13
- Django: 5.1
- Scraping tool: Playwright | Selenium | Pure HTTP requests + BeautifulSoup

I also remember that Coding for Entrepreneurs had a tutorial on scraping with Celery. I’ll watch it first before kicking off the project. In the next part, we won’t dive into app development just yet—instead, we’ll focus on setting up the project structure and docs.  
[https://www.youtube.com/watch?v=rfM3Jli81fU](https://www.youtube.com/watch?v=rfM3Jli81fU)

As far as I know, our university LMS doesn’t have any IP restrictions, so requests from a single VPS shouldn’t get blocked. Still, it might be smart to build a Django app called "proxy" to find some solid free proxies we can use to mask our requests. I’m not sure how to implement proxies with Python requests—I’ve only heard about it. We might also need to tweak the User-Agent and other headers… but we’ll figure it out as we go!

I should also mention that the previous version of LMS Log, written in Python, used asynchronous requests with Aiohttp. I found JavaScript’s async/await system way more appealing, but here we are again—async Python. I might need to revisit [https://www.manning.com/books/python-concurrency-with-asyncio](https://www.manning.com/books/python-concurrency-with-asyncio).  
Annnnnnd, I’m not really thrilled about diving back into that! :)

End of part 1.