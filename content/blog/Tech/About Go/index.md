---
title: Go - Simple, concurrent code in minutes
author: Deepak
tags: [tech, language]
date: "2021-03-07"
thumbnail: ./images/langza.png
description: Links I found useful about Go.
---

# Go - Simple, concurrent code in minutes
This post consists of various links and excerpts that I collected while deciding a language for a project that demanded multi-threading capabilities and low latency. Go was one of the candidates but I did not go ahead with it because of latency demands. Hence, I have no real programming experience in Go but the links would prove useful to anyone who wants to know more about Go, it's advantages and disadvantages and use cases.

* [Concurrency in Go](https://www.youtube.com/watch?v=LvgVSSpwND8)
* Go is unapologetically simple
* Thread binding in Go
    - [Source 1](https://stackoverflow.com/questions/19758961/is-it-possible-to-force-a-go-routine-to-be-run-on-a-specific-cpu)
    - [Source 2](https://stackoverflow.com/questions/32452610/golang-how-to-handle-blocking-tasks-optimally)
* Goroutines
    * Cheaper than threads
    * Can communicate using channels, but prone to blocking
    * The Goroutines are multiplexed to fewer number of OS threads. There might be only one thread in a program with thousands of Goroutines. If any Goroutine in that thread blocks say waiting for user input, then another OS thread is created and the remaining Goroutines are moved to the new OS thread. All these are taken care by the runtime and we as programmers are abstracted from these intricate details and are given a clean API to work with concurrency. [Source](https://golangbot.com/goroutines/)
    * Threads vs GoRoutines. [Source](https://medium.com/rungo/achieving-concurrency-in-go-3f84cbf870ca)

|Thread|Goroutine|
|------|---------|
| OS threads are managed by kernal and has hardware dependencies. | goroutines are managed by go runtime and has no hardware dependencies. |
| OS threads generally have fixed stack size of 1-2MB| goroutines typically have 8KB (2KB since Go 1.4) of stack size in newer versions of go |
| Stack size is determined during compile time and can not grow | Stack size of go is managed in run-time and can grow up to 1GB which is possible by allocating and freeing heap storage |
| There is no easy communication medium between threads. There is huge latency between inter-thread communication. | goroutine use \`channels\` to communicate with other goroutines with low latency ([read more](https://blog.twitch.tv/gos-march-to-low-latency-gc-a6fa96f06eb7)). |
| Threads have identity. There is TID which identifies each thread in a process. | goroutine do not have any identity. go implemented this because go does not have TLS([Thread Local Storage](https://msdn.microsoft.com/en-us/library/windows/desktop/ms686749(v=vs.85).aspx)). |
| Threads have significant setup and teardown cost as a thread has to request lots of resources from OS and return once it's done. | goroutines are created and destroyed by the go's runtime. These operations are very cheap compared to threads as go runtime already maintain pool of threads for goroutines. In this case OS is not aware of goroutines. |
| Threads are preemptively scheduled ([read here](https://stackoverflow.com/questions/4147221/preemptive-threads-vs-non-preemptive-threads)). Switching cost between threads is high as scheduler needs to save/restore more than 50 registers and states. This can be quite significant when there is rapid switching between threads. | goroutines are coopertively scheduled ([read more](https://stackoverflow.com/questions/37469995/goroutines-are-cooperatively-scheduled-does-that-mean-that-goroutines-that-don)). When a goroutine switch occurs, only 3 registers need to be saved or restored. |

* Go’s concurrency model is a good fit for server-side applications that must primarily handle multiple independent requests, rather than participate in complex result-passing schemes.
* Go has great tooling to diagnose concurrency and performance problems, and cross-compilation makes deploying on whichever platform a breeze.
* Concurrency

_Most languages have some form of support for concurrent programming (doing multiple things at once), but Go was designed for this job from the ground up. Instead of using operating system threads, Go provides a lightweight alternative: **goroutines**. Each goroutine is an independently executing Go function, which the Go scheduler will map to one of the OS threads under its control. This means that the scheduler can very efficiently manage a large number of concurrent goroutines, using only a limited number of OS threads._

_Consequently, you can run millions of concurrent goroutines in a single program without creating serious performance problems. That makes Go the perfect choice for high-scale concurrent applications such as webservers and microservices._
[Source](https://bitfieldconsulting.com/golang/rust-vs-go)

* _My take: Go for the code that has to ship tomorrow, Rust for the code that has to keep running untouched for the next five years.  
—Grzegorz Nosek_

* [GUI Apps](https://github.com/wailsapp/wails)