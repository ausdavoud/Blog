---
title: "ترمز رو بکش عمو آلن"
date: 2024-02-21
keywords: halting problem, turing
lang: fa
dir: rtl
---

خب. اگه سر کلاس [دکتر نصر](https://sciold.ui.ac.ir/~nasr_a/) یا [دکتر رفیعی](https://mcs.ui.ac.ir/page-professors1/fa/45/showblock/blktool_dorsaetoolsenforcementactivities_sample_professors_block9029/21476/sp-400017) بودید، احتمالا عبارت Halting Problem به گوشتون خورده. همون جلسات اول سر کلاس برنامه نویسی مقدماتی بودیم که برای اولین بار آوای غریب اسمش در کلاس پیچید و من حتی نتونستم تلفظ درستش رو متوجه بشم. 
گذشت تا ترم دو سر کلاس دکتر نصر، وسطای ترم بود که باز این قضیه مطرح شد. بحث سر قضیه قطری کانتور بود که سر و کله اینم پیداش شد. تلاش آلن تورینگ برای حلش مورد بحث قرار گرفت، و البته چه لنگه کفشی بود در بیابانِ خشک و بی‌آب و علفِ پیدا کردنِ موضوع برای ارائه‌یِ درسِ مبانیِ علومِ ریاضی.
اگر اشتباه نکنم یکی دو تن از دوستان عزیز هم به اتفاق ارائه‌ای در این باب دادن که خب دستشونم درد نکنه.

گذشت تا چند وقت پیش که یه [مطلبی دیدم](https://www.alexmolas.com/2022/10/19/halting-problem.html) بسیار مختصر و مفید درباره The Halting Problem که خیلی چشمک میزد. با خودم گفتم اووف. چه چیز تمیزی برای ارائه مبانی علوم ریاضی! از ما که گذشت، ولی ترجمه کنیم برای آیندگان که اگر باز این بساط ارائه دادنا به پا بود شاید به دردشون بخوره. خلاصه دو سه بار خوندمش تا یه چیزایی دستگیرم شد و البته [یه نیمچه بازی](https://busy-beavers.tigyog.app/the-halting-problem) هم معرفی کرده بود که خیلی کامل‌تر توضیحش می‌داد و حتما پیشنهاد میکنم برای درک عمیق‌تر انجامش بدین.

بریم ببینیم جریان چی بوده اصن. خیلی خلاصه بخوام بگم،‌ صورت سوال اینه:
	*آیا تابعی وجود داره که به عنوان ورودی، یه تابع بگیره و به عنوان خروجی، بهمون بگه تابع ورودیمون، پایان‌پذیره یا نه؟* اصطلاحا halt میکنه یا نه؟

شاید لازم باشه یه بار دیگه بخونیدش. منظورم از پایان‌پذیری اینه که تا ابد لوپ نشه. مثلا کد زیر تا ابد توی حلقه گیر میکنه و لوپ میشه:
```python
while True:
	print("Oh shit, here we go again!")
```

لازم به ذکره که to halt یعنی توقف کردن و کلا بحث سر اینه که یه تابعی بنویسیم که بهمون بگه یه تابع دیگه قراره یه جایی توقف کنه یا خیر.
این سوال ذهن آقای آلن تورینگ، بابای علوم‌کامپیوتریا رو به خودش مشغول کرده بود. کِی؟ سال ۱۹۳۶. اگه در مورد آلن تورینگ میخواید بیشتر بدونید، شاید دیدن فیلم The Imitation Game (بازی تقلب) با نقش آفرینی بندیکت کمبریج خالی از لطف نباشه.
خب برگردیم سر موضوع خودمون. اینجا میخوایم جا پای عمو آلن بذاریم، ببینیم میشه فهمید چطوری جواب این سوال رو پیدا کرد یا نه...
همونطور که گفتم اگه سر کلاسای دکتر رفیعی و نصر بوده باشید، حتما اسم این مسئله به گوشتون خورده. یه نگاه به صورت سوال بندازیم:
*آیا تابعی وجود داره که به عنوان ورودی، یه تابع بگیره و به عنوان خروجی، بهمون بگه تابع ورودی پایان‌پذیره یا نه؟*

هممم، یه تابعی داریم ... که یه تابعی رو میگیره ... . خب همین جا صبر. جنس فاعل و مفعول رو عنایت بفرمایید: دوتاش تابعه. 
این جور گزاره ها معمولا به `خود ارجاعی` یا `self reference` معروفن. یعنی موضوع مورد بحث گزاره، خودش رو هم شامل میشه. مثال دیگه‌ای از خودارجاعی، پارادوکس دروغگو هست:
\
این جمله دروغه.
\
در واقع این گزاره داره به خودش اشاره می‌کنه. ولی آیا ارزشش درسته؟ یا غلط؟ یا هیچ‌کدام؟
\
خب دو حالت بیشتر نداریم دیگه، یا واقعا این جمله راسته یا دروغه.
\
۱- راسته: پس داره راست میکه که این جمله دروغه. پس جمله دروغه.
\
۲- دروغه:‌ پس داره دروغ میگه که این جمله دروغه. پس جمله راسته. 
\
WTF!? (What The Function)
\
خب، این موضوع که مسئله‌ی توقف یه جور خود ارجاعی محسوب میشه، آلن تورینگ رو قلقلک می‌داد...

برای شروع، اجازه بدید یکم کد وارد قضیه کنیم:
\
عمو اومد با خودش گفت: اگه واقعا همچین تابعی وجود داشته باشه چی؟ مثلا فرض کنیم یه تابعی به نام halts داریم که یه ورودی میگیره و true یا false برمیگردونه. اگه متوقف شد، true. اگه تا ابد ادامه پیدا کرد، false.
```python
def halts(function_str):
	...
```
چند تا نکته:

۱- ما فعلا نمیدونیم که این تابع halts چجوری کار میکنه. صرفا فرض میکنیم وجود داره. به خاطر همین سه نقطه ... گذاشتیم. اما یه چیزو می‌دونیم و اونم اینه که اگر function_str (ورودی تابع) پایان‌پذیر باشه، true و اگر پایان‌ناپذیر باشه false برمیگردونه.

۲- سه نقطه (...) در پایتون تقریبا حکم pass رو داره، هیچ کاری نمیکنه ولی ارور هم نمیده. یه جور placeholder هست. صرفا می‌ذاریمش تا مثلا بعدا تابع رو کامل کنیم (Spoiler Alert: هیچ‌وقت این کارو نمی‌کنیم :)

۳- دقت کنید که اگر تابعی که به halts میدیم قرار باشه تا ابد تو حلقه گیر کنه، باعث نمیشه خود halts هم تا ابد تو حلقه گیر کنه ها! اصلا ذات halts همینه که اگه فلان تابع خواست تا ابد تو حلقه گیر کنه، به ما false بده و از این بابت مطلعمون کنه. 
برای درک بهتر میتونید این تابع رو یه جور ضمیر آگاه از تابع فرض کنید. مثلا ما انسان‌ها وقتی به 
```python
while True:
	...
```
برمی‌خوریم، مغزمونم تو حلقه گیر میکنه؟ خب معلومه که نه، ولی میفهمیم که این یه حلقه ایه که هیچ وقت تموم نمیشه. halts هم همینطوریه،‌ حتی اگه تابعی که بهش میدیم تا ابد قرار باشه کار کنه، halts به ما false رو برمی‌گردونه، ما رو از باطن تابع آگاه می‌کنه.

۴- ما کد اون تابعی که میخوایم بررسیش کنیم رو به صورت متنی و string به تابع halts پاس میدیم. 
مثلا فرض کنید یه همچین تابعی داریم:

```python
def some_func():
	while True:
		...
```
حالا نسخه str شدش رو اماده میکنیم:

```python 
some_funct_str = """
def some_func():
	while True:
		...
"""
```
و پاس میدیم به halts:

```python
result = halts(some_func_str)
print(result)
```
الان چی باید پرینت بشه؟ false. چرا؟ چون some_func_str هالت نمیکنه. متوقف نمیشه. پس جواب هالت شدنش false ئه.\
اما صبر کنید. بیشتر توابعی که ما باهاشون سر و کار داریم یه مقادیری رو به عنوان ورودی می‌گیرن و بعد یه کاری رو انجام میدن. پس بهتره تابع halts ای که تعریف می‌کنیم، طوری باشه که بتونیم علاوه بر یک تابع، ورودی های مورد نظرش رو هم بدیم و این سوال رو بپرسیم:
*آیا اگر فلان ورودی ها رو به این تابع بدیم، تابع متوقف میشه یا نه؟* \
پس تابع halts رو یکم تغییر میدیم و halts_on رو ایجاد می‌کنیم. در واقع موقع صدا زدن تابع `halts_on`، داریم ازش سوال می‌پرسیم که آیا `func_str` اگه مقداری مثل `args` بهش پاس داده بشه، متوقف میشه؟

```python
def hatls_on(func_str, args):
	...
```

خب، این halts_on دم دستتون باشه فعلا. الان یه لحظه می‌خوایم ببینیم منظور از پاس دادن سورس کد به عنوان ورودی به تابع چیه.
\
فرض کنید یه تابع داریم با این شکل و شمایل:
```python
def apple_func(string):
	if 'apple' in string:
		while True:
			...
```
به زبون ساده، داره میگه اگر ورودی تابع داخلش `apple` داشت، تا ابد لوپ شو.

حالا یه سوال، اگه کد این تابع رو به خودش پاس بدیم چی میشه؟
```python
apple_func_str = """
def apple_func(string):
	if 'apple' in string:
		while True:
			...
"""
apple_func(apple_func_str)
```
خب الان تا ابد لوپ میشه؟
بله میشه. چرا؟ چون توی سورس کد تابع، کلمه `apple` ذکر شده، در نتیجه شرط true میشه و while اجرا. 
این یه نمونه از مواقعی بود که سورس یه تابع رو به خودش پاس میدیم.

حالا تابع halts_on رو به یاد بیارید، یه تابع و ورودی هاشو می‌گرفت و می‌گفت که اگر با اون ورودی ها اجراش کنیم، متوقف میشه یا نه. کد خاصی هم نداشت، صرفا فرض کردیم وجود داره.
حالا بیایید یه تابع دیگه هم تعریف کنیم و اسمشو بذاریم halts_on_self. چی کار میکنه؟ اول کدشو نگاه کنید:
```python
def halts_on_self(func_str):
	return halts_on(func_str, func_str):
```

همون halts_on عه، با این تفاوت که موقع بررسی یه تابع، به ازای ورودی های داینامیک و مختلفی بررسیش نمی‌کنه. فقط و فقط به ازای سورس کد خود اون تابع بررسیش می‌کنه.
مثال:
```python
def length_check(text):
	if len(text) > 20:
		while True:
			print('yamete kudasai')
	print('stop')
```
تابع `length_check` رو می‌بینید، که اگر طول رشته ورودیش بیشتر از ۲۰ حرف باشه، یه لوپ بینهایت رو اجرا میکنه و هیچ وقت تموم نمیشه. در غیر این صورت پیغام استاپ رو نمایش میده و تموم میشه.
```python
>>> length_check('I Love QMars')
stop
>>> length_check('This sentence is loooooooong.')
yamete kudasai
yamete kudasai
yamete kudasai
yamete kudasai
...
```
حالا فرض کنید به تابع `length_check` سورس کد خودشو بدیم:
```python
>>> length_check_str = """def length_check(text):
	if len(text) > 20:
		while True:
			print('yamete kudasai')
	print('stop')
	"""
>>> length_check(length_check_str)
yamete kudasai
yamete kudasai
yamete kudasai
yamete kudasai
...
```
خب مشخصه که تعداد حروف سورس کد تابع از ۲۰ تا بیشتره پس توی لوپ میفته.

حالا اون تابع halts_on_self رو به یاد بیارید. میگه آقا من هر تابعی که بهم بدی، سورس کدش رو به خورد خودش میدم. اگه متوقف شد بهت میگم true. اگر توی لوپ گیر کرد بهت میگم false. همین.

پس یه بار روند رسیدن به تابع halts_on_self رو مرور کنیم.
\
۱- تابع halts: سورس یه تابع رو می‌گیره و میگه متوقف میشه یا نه.
\
۲- تابع halts_on: سورس یه تابع و ورودی هاشو می‌گیره و میگه آیا این تابع وقتی این ورودی ها رو بهش میدیم متوقف میشه یا نه.
\
۳- تابع halts_on_self:‌ سورس یه تابع رو می‌گیره، ولی دیگه ورودی هاشو نمی‌گیره. به جاش میاد همون سورس کد رو به عنوان ورودی به خورد تابع میده و میگه آیا تحت این شرایط تابع متوقف میشه یا نه.

خب تا اینجا کار زیاد خاصی نکردیم. صرفا شرایط مسئله رو یه جورایی ایجاد کردیم و فرض کردیم فلان تابع وجود داره.
اما زرنگی عمو آلن همینجا گل کرد. یه جوری توابع رو به هم بافوند که خودشونم نفهمیدن چی شد. 

یه تابع دیگه تعریف می‌کنیم، مثلا `crazy_clown`
```python
def crazy_clown(func_str):
	if halts_on_self(func_str):
		while True:
			...
```
دلقک دیوونه ما چی کار میکنه؟
\
سورس کد یه تابع رو می‌گیره، بعد همین سورس کد رو به خورد تابع میده و بررسی میکنه که متوقف میشه یا نه.
اما یکم عجیب رفتار میکنه: 

اگه تابع ورودی متوقف شد، دلقک دیوونه یه لوپ اجرا میکنه و تا ابد تو حلقه میمونه.
\
اگه تابع ورودی متوقف نشد، که خب این دیوونه کاری نمی‌کنه.

اما سیرک اینجا شروع میشه:
```python
crazy_clown(crazy_clown_str)
```

که `crazy_clown_str` در واقع سورس کد تابعه:
```python
crazy_clown_str = """def crazy_clown(func_str):
	if halts_on_self(func_str):
		while True:
			...
"""
```

اما چرا؟ مگه این `crazy_clown(crazy_clown_str)` چی داره که هوموساپینس رو دلقک خودش کرده؟
برای پیدا کردن جواب این سوال، باید به سوال زیر پاسخ بدیم:
\
آیا `crazy_clown(crazy_clown_str)` متوقف میشه؟

برای جواب دادن به این سوال هم باید سورس کدشو نگاه کنیم.
\
همه چیز به اون شرط `if halts_on_self(func_str)` بستگی داره. اگه true بشه، دلقک لوپ میشه، اگه false بشه لوپ نمیشه. 

```python {2}
def crazy_clown(func_str):
	if halts_on_self(func_str):
		while True:
			...
```


خب. به هر حال که دو حالت بیشتر نداره. یا true یا false. 
\
فرض کنیم true شده. یعنی چی؟ یعنی halts_on_self ما true شده.
یعنی اگر به تابع
crazy_clown
سورس کد خودشو پاس بدیم متوقف میشه. 
\
حالا اینور قضیه رو هم بچسبید. اگه
true
شده، پس
while true
ای که خط بعدی بود اجرا میشه. 
```python {3}
def crazy_clown(func_str):
	if halts_on_self(func_str): # Assuming it's True
		while True:
			...
```
پس
crazy_clown
تا ابد اجرا میشه و متوقف نمیشه. یعنی فرض کردیم متوقف میشه ولی به این رسیدیم که متوقف نمیشه.

خراب شد که :(
\
شاید مشکل اینه که فرض کردیم
true
عه. حالا فرض کنیم
false
میشه.
یعنی چی؟ یعنی
halts_on_self
ما
false
شده. یعنی اگر به تابع
crazy_clown
سورس کد خودشو پاس بدیم متوقف **نمیشه**. 
حالا اینور قضیه رو هم بچسبید. اگه false شده، پس while true ای که خط بعدی بود اجرا نمیشه و تابع تموم میشه. پس crazy_clown متوقف میشه. در صورتی که halts_on_self گفته بود تابع تا بینهایت لوپ میشه!

و این یعنی تناقض. از هر طرف که رفتیم جز وحشتمان نیفزود. هر سوراخی رو پر کنیم از یه جای دیگه ای چیکه میکنه.  قضیه شد مثل همون 
`این جمله دروغ است`.
\
اما تناقض از کجا ناشی شد؟ از جایی که فرض کردیم تابعی به نام halts وجود خارجی داره. بعد هی آجر به آجر روش سنگ بنامونو ایجاد کردیم،
halts_on، 
halts_on_self 
و دست آخر دلقک دیوونه که سیرک رو بهم زد. پس کلا فرض اولیه‌مون باطله. تابعی برای تمام تابع ها وجود خارجی نداره.

البته این اثبات تا حدود زیادی خودمونی بود. اثبات قوی تر و بهتری برای این مسئله - با استفاده از روش قطری کانتور - وجود داره، که احتمالا در درس مبانی علوم ریاضی مطالعه خواهید کرد. ولی به نظرم چنین اثباتی یه خوراک ملات دار برای ارائه هاست.

در اینجا، لازمه دوباره از دوست خوبم محمد جان ملایی خیلی موتشکر بشم که این تمپلیت رو به من هدیه داد و این شد اولین پست بلاگ.
\
اگه گیتهاب دارید و تا اینجا اومدید پایین، برای حمایت ازش میتونین به پروژه‌اش ستاره بدین:
\
[Blogger - A Blog Template (Maybe a little more)](https://github.com/mohammad-mallaee/blogger) 
\
موفق و پیروز باشید.

اسفند ۱۴۰۲