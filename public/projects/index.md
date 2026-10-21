---
title: Projects
---

## Code

<ProjectCollection section="code">

<ProjectItem
  title="MIT 6.S081 Journey"
  pinned="true"
  wide="true"
  banner="/projects/banners/mit-journey.webp"
  subtitle="MIT's OS course, self-taught"
  href="https://github.com/ausdavoud/MIT-6.S081-Journey"
  description="I'm doing MIT 6.S081 (Fall 2021) on my own: lectures, the xv6 book and the labs on RISC-V. The repo is my checklist and notes."
  details={`So far: Lab 1 (util) 100/100, Lab 2 (syscall) 35/35, and Lab 3 (pgtbl) 2 of 3, still in progress. The notes include the parts that confused me, written down honestly. I even had to add two lines to the Makefile before xv6 would compile on a recent toolchain.

Page tables were rough. That's why I wrote a whole blog post about them.`}
  expertiseShort="OS"
  expertise="Operating Systems"
>
  <ProjectTag name="C" />
  <ProjectTag name="RISC-V" />
  <ProjectTag name="xv6" />
</ProjectItem>

<ProjectItem
  title="CPU Simulation"
  pinned="true"
  banner="/projects/banners/cpu-simulation.webp"
  subtitle="Mano's Basic Computer"
  href="https://github.com/cpu-simulation/simulation-microprocessors"
  demo="https://cpu-simulation.github.io/simulation-microprocessors/"
  description="Mano's 16-bit Basic Computer, built from bits in Python, with a web IDE to write assembly, run it and watch the registers."
  details={`Nothing in the datapath uses Python integers. The registers, the 16-bit bus (one multiplexer per bit) and the ALU all work on lists of bits. The control unit is hardwired, so each control signal is a Boolean expression of the timing and opcode signals, written the way the textbook writes them.

There's an assembler for the whole instruction set with direct and indirect addressing, and a small Django REST API around a single CPU. The React front end has an instruction editor, a memory view and a register panel, and it follows your light or dark theme.

Made together with my teammates in the simulation team.`}
  expertiseShort="ARCH"
  expertise="Computer Architecture"
>
  <ProjectTag name="Python" />
  <ProjectTag name="Django" />
  <ProjectTag name="React" />
</ProjectItem>

<ProjectItem
  title="Notary Office"
  pinned="true"
  banner="/projects/banners/notary.webp"
  subtitle="Fair commission sharing"
  href="https://github.com/ausdavoud/notary"
  description="Each new commission goes to the notary with the lowest revenue so far. It replaces the paper notebook an office kept this count in."
  details={`Agents log commissions, the backend adds up every notary's revenue with the formula the law defines, and the next commission goes to whoever has earned the least. Data is scoped by city, so notaries only see their own city. There are three roles (admins, agents and notaries), and admins and agents can be assigned per province and city.

Django REST Framework and PostgreSQL behind a Next.js front end, all started with Docker Compose. It was sponsored by Notary Office 179 in Shoush.`}
  expertiseShort="FS"
  expertise="Full-Stack Engineering"
>
  <ProjectTag name="Django" />
  <ProjectTag name="PostgreSQL" />
  <ProjectTag name="TypeScript" />
  <ProjectTag name="Docker" />
</ProjectItem>

<ProjectItem
  title="Thing Detector"
  banner="/projects/banners/thing-detector.webp"
  subtitle="Webcam object detection"
  href="https://github.com/ausdavoud/thing-detector"
  description="A React page streams webcam frames to Django Channels, and YOLOv8 sends back boxes that get drawn over the live video."
  details={`The browser sends a JPEG frame every 150 ms. The backend decodes it with OpenCV and runs YOLOv8n in a thread pool, so one slow frame doesn't hold up the other connections. The model loads once, when the server starts. A sidebar counts what it sees by class.

We were a team of four, and we presented it with animated slides.`}
  expertiseShort="ML"
  expertise="Machine Learning"
>
  <ProjectTag name="Python" />
  <ProjectTag name="Django" />
  <ProjectTag name="React" />
  <ProjectTag name="YOLOv8" />
</ProjectItem>

<ProjectItem
  title="Hubro Backend"
  banner="/projects/banners/hubro.webp"
  subtitle="Backend for a business game"
  href="https://github.com/ausdavoud/hubro-back"
  description="A classroom game where student teams run a company quarter by quarter. This is its Django REST backend."
  details={`The game covers factories, R&D, suppliers, contracts, loans and ESG reports. A decision doesn't pay off right away. Loan interest, a factory's depreciation or a finished production run lands in a later quarter as a "ripple task", and the team's state moves on. Getting that scheduling right was the heart of the project.

It runs on Django 5, DRF, PostgreSQL 16 and Channels, with JWT auth and Swagger docs, and starts locally with Docker Compose. I built it with a few teammates.`}
  expertiseShort="BE"
  expertise="Backend Engineering"
>
  <ProjectTag name="Python" />
  <ProjectTag name="Django" />
  <ProjectTag name="PostgreSQL" />
  <ProjectTag name="Docker" />
</ProjectItem>

<ProjectItem
  title="To The Theath"
  banner="/projects/banners/to-the-theath.webp"
  subtitle="A wizard duel over sockets"
  href="https://github.com/ausdavoud/ToTheTheath"
  description="A two-player wizard duel. Each round you strike, cast magic or defend. Pygame client, plain TCP server."
  details={`Each round the server settles the strike, magic or defend choices with the characters' odds. Players who press start wait in a queue until a second one shows up, then get paired. Every message is a small JSON object with a header, the server waits for both moves before resolving a round, and every match is logged round by round. Each wizard has different odds: Dumbledore hits hardest, and Harry's spells miss a lot but his magic recovers fastest.

Our final project for Advanced Programming, spring 2023, made with Mohammad Mallaee.`}
  expertiseShort="GAME"
  expertise="Game Development"
>
  <ProjectTag name="Python" />
  <ProjectTag name="Pygame" />
  <ProjectTag name="Sockets" />
</ProjectItem>

<ProjectItem
  title="Wordle, CS Edition"
  banner="/projects/banners/wordle.webp"
  subtitle="Wordle with CS words"
  href="https://github.com/ausdavoud/wordle"
  demo="https://cs-wordle.vercel.app"
  description="A Wordle clone with computer science words like STACK, LOGIC and CODER. Plain HTML, CSS and JavaScript."
  details="Five letters, six tries. You can type or use the on-screen keyboard. The answers live in one array in script.js, so adding more words is just a paste away."
  expertiseShort="FE"
  expertise="Frontend Engineering"
>
  <ProjectTag name="JavaScript" />
  <ProjectTag name="HTML" />
  <ProjectTag name="CSS" />
</ProjectItem>

<ProjectItem
  title="OrderMan"
  banner="/projects/banners/orderman.webp"
  subtitle="Telegram orders to CSV"
  href="https://github.com/ausdavoud/OrderMan"
  description="A Telegram bot that reads an order message, asks you to confirm it, and merges confirmed orders into daily CSV files."
  details="Orders come in a fixed Persian template. Tags like #نان (bread) and #پیش (pre-order) send them to separate tables. Two FastAPI services run on Deta Space: one talks to Telegram with aiogram, the other stores orders in Deta Base and runs the daily merge at noon."
  expertiseShort="BE"
  expertise="Backend Engineering"
>
  <ProjectTag name="Python" />
  <ProjectTag name="FastAPI" />
  <ProjectTag name="aiogram" />
</ProjectItem>

<ProjectItem
  title="How many bits?"
  banner="/projects/banners/how-many-bits.webp"
  subtitle="An animated proof in Manim"
  href="https://github.com/ausdavoud/How-Many-Bits-Manim"
  demo="https://ausdavoud.github.io/How-Many-Bits-Manim/"
  description="Why does 8 need 4 bits when ⌈log₂ 8⌉ is 3? These slides work it out and end at n = ⌈log_b(N + 1)⌉ for any base."
  details="This began as a Google Colab notebook. When I moved it here I split it into one scene per chapter and fixed two slips in the maths: the formula said log N + 1 where it meant log(N + 1), and log₂ 13 is about 3.7, not 3.5. I also added a short proof of the bonus identity and a last chapter that answers the questions the notebook left open."
  expertiseShort="MATH"
  expertise="Math Visualization"
>
  <ProjectTag name="Python" />
  <ProjectTag name="Manim" />
</ProjectItem>

<ProjectItem
  title="1's Complement"
  banner="/projects/banners/ones-complement.webp"
  subtitle="Why the carry goes back in"
  href="https://github.com/ausdavoud/1s-Complement-Manim"
  demo="https://ausdavoud.github.io/1s-Complement-Manim/"
  description="In 1's complement a 1 sometimes falls off the left end, and you add it back. These slides show why that works."
  details="It starts with 5 + (−3) in 4 bits, which gives 1 0001, and adding the stray 1 back gives 0010. Then come two rules about complements, a plane that shows when a sum overflows, and a proof of every case: x + y, x − y and −x − y. Rendered with Manim, published as slides and as one video."
  expertiseShort="MATH"
  expertise="Math Visualization"
>
  <ProjectTag name="Python" />
  <ProjectTag name="Manim" />
</ProjectItem>

</ProjectCollection>

## Research & Labs

<ProjectCollection section="research-labs">

<ProjectItem
  title="GLKM Research"
  pinned="true"
  banner="/projects/banners/glkm.webp"
  subtitle="My bachelor's thesis"
  href="https://github.com/ausdavoud/GLKM-Research"
  description="A greedy k-means that merges the cheapest pair of clusters. I tried two ways to improve it. Neither worked, and the thesis says why."
  details={`Before touching GLKM I went back and read how k-means got here: Lloyd, MacQueen, Hartigan and Wong, k-means++. To actually see the differences I made two step-by-step pages that run MacQueen and Hartigan–Wong next to Lloyd.

Idea one was letting GLKM pick k by itself, using the elbow of the cost curve. On Gisette the curve is almost a straight line, so the "elbow" it found (k = 5) means nothing. The data has two classes.

Idea two was starting from a k-means++ partition instead of from single points. It made runs slower and the clustering worse. Not the result I wanted, but now I know why it fails.

The thesis is in Persian and was supervised by Dr. Najmeh Hosseini Monjezi.`}
  expertiseShort="ML"
  expertise="Machine Learning"
>
  <ProjectTag name="Python" />
  <ProjectTag name="k-means" />
  <ProjectTag name="LaTeX" />
</ProjectItem>

<ProjectItem
  title="OS Problem Sets"
  pinned="true"
  banner="/projects/banners/os-problem-sets.webp"
  subtitle="I was the TA"
  href="https://github.com/ausdavoud/OS-Course-Problem-Sets"
  description="Five problem sets with solutions for Principles of Operating Systems, Fall 2025. I was a TA, so I helped write them, in Persian."
  details="Everything is in Persian and typeset with XeLaTeX. They follow the course from what an OS is, through processes, threads and scheduling, to synchronization (Dekker, Peterson, semaphores, monitors). Each set has a handout with empty answer boxes and a solutions version. Set 2 never got its solutions, and set 3 leaves out the answers that are code. Written together with the other TAs."
  expertiseShort="OS"
  expertise="Operating Systems"
>
  <ProjectTag name="LaTeX" />
</ProjectItem>

<ProjectItem
  title="OS Exercises"
  pinned="true"
  banner="/projects/banners/os-exercises.webp"
  subtitle="C, from pointers to fork()"
  href="https://github.com/ausdavoud/Operating-Systems-Exerices"
  description="C exercises from my OS course: pointers, splitting a program into files, process memory and growing a tree with fork()."
  details="Four sessions plus a folder of judged problems from Quera: six problems and two fork() assignments. The more fun ones print Pascal's triangle and a diamond of stars in the terminal."
  expertiseShort="OS"
  expertise="Operating Systems"
>
  <ProjectTag name="C" />
  <ProjectTag name="Linux" />
</ProjectItem>

<ProjectItem
  title="Medical Data Mining"
  banner="/projects/banners/medical-data-mining.webp"
  subtitle="Stats on patient data"
  href="https://github.com/ausdavoud/Medical-Data-Mining"
  description="Exercises and the final exam from Prof. Marateb's course, in SPSS, Python and by hand. Always asking when a number means less than it seems."
  details={`Outlier detection with 3σ, Hampel and Tukey. Scaling as a fix for an ill-conditioned least-squares problem, where the condition number dropped from 6×10¹¹ to 2.8. An odds ratio of 1.50 that turned out not to be significant. A diabetes test whose false discovery rate is 98% or 36%, depending on prevalence.

The exercises were group work with full write-ups in Persian LaTeX. I solved the final exam on my own.`}
  expertiseShort="DM"
  expertise="Data Mining"
>
  <ProjectTag name="Python" />
  <ProjectTag name="Jupyter" />
  <ProjectTag name="SPSS" />
  <ProjectTag name="LaTeX" />
</ProjectItem>

<ProjectItem
  title="Hamming Code"
  banner="/projects/banners/hamming-code.webp"
  subtitle="Error correction vs Shannon"
  href="https://github.com/ausdavoud/Hamming-Code"
  description="Hamming codes sent through a noisy channel and compared with Shannon's limit, for Information Theory and Coding."
  details={`Ten blocks of the (7, 4) code go through a channel that flips each bit with probability 0.07. Three single flips get fixed. One block took two flips, and the decoder, which assumes at most one error, made it worse.

At p = 0.01 the (7, 4) code cuts errors tenfold, (15, 11) fivefold and (31, 26) threefold. Longer codes spend less on parity, so they also stop being useful sooner. There's a full chain too: a Huffman-coded source, then Hamming, then the channel.`}
  expertiseShort="INFO"
  expertise="Information Theory"
>
  <ProjectTag name="Python" />
  <ProjectTag name="Jupyter" />
</ProjectItem>

<ProjectItem
  title="Logic and Set Theory"
  banner="/projects/banners/logic-set-theory.webp"
  subtitle="Group exercises in Persian"
  href="https://github.com/ausdavoud/Logic-and-Set-Theory-Exercises"
  description="Five problem sets for Fundamentals of Logic and Set Theory, solved in Persian and typeset with XeLaTeX."
  details="They start with structural induction and propositional logic (equivalence, consequence, resolution) and end with first-order logic: twelve semantic tableaux, with countermodels for the invalid ones. We were a group of five, for Dr. Ghari's course."
  expertiseShort="LOGIC"
  expertise="Mathematical Logic"
>
  <ProjectTag name="LaTeX" />
</ProjectItem>

<ProjectItem
  title="Prescriptions DB"
  banner="/projects/banners/sql-lab.webp"
  subtitle="Database lab final project"
  href="https://github.com/ausdavoud/SQL-Lab-Final-Project"
  description="A SQL Server database for a clinic: doctors, patients, medicines and prescriptions, with queries, a function and a procedure."
  details="Five tables, with a composite key linking prescriptions to medicines. Reports like revenue per year and the biggest spenders, a function that totals the units of a drug and a procedure that uses it, and harder ones such as drugs a patient got from more than one doctor. We added an Appointment table of our own. Done with Hosna Soltanolkottabi, and we recorded two walkthrough videos."
  expertiseShort="DB"
  expertise="Databases"
>
  <ProjectTag name="SQL Server" />
</ProjectItem>

<ProjectItem
  title="Least Squares and QR"
  banner="/projects/banners/scientific-computing.webp"
  subtitle="Final project, no numpy"
  href="https://github.com/ausdavoud/Scientific-Computing-Final-Project"
  description="Least squares through Cholesky and Householder QR, written by hand in plain Python on nested lists."
  details="Every matrix operation is written from scratch, from multiplication to the factorizations, and the results match numpy's to the last printed digit. This was the final project for Scientific Computing 1, spring 2024. Part A fits a line to four points with the normal equations. Part B factors a 3 × 3 matrix as QR with Householder reflections and solves it by back substitution."
  expertiseShort="NUM"
  expertise="Numerical Computing"
>
  <ProjectTag name="Python" />
</ProjectItem>

<ProjectItem
  title="ML Exercises"
  pinned="true"
  banner="/projects/banners/ml-exercises.webp"
  subtitle="Seventh-semester ML course"
  href="https://github.com/ausdavoud/Machine-Learning-Exercises"
  description="Six assignments from Dr. Alambardar's ML course, each a notebook plus written theory: regression, neural nets, SVMs, clustering, PCA."
  details={`A few that I liked: gradient descent with learning rates that converge, crawl or blow up. A degree-15 boundary that overfits the two moons until L2 reins it in. A two-layer network in NumPy with softmax and backprop. A linear and an RBF SVM on handwritten digits. K-means from scratch, then a photo squeezed down to 24 colors.

University of Isfahan, B.Sc. Computer Science, Fall 2025.`}
  expertiseShort="ML"
  expertise="Machine Learning"
>
  <ProjectTag name="Python" />
  <ProjectTag name="NumPy" />
  <ProjectTag name="Jupyter" />
  <ProjectTag name="Matplotlib" />
</ProjectItem>

</ProjectCollection>
