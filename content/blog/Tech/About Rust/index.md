---
title: Rust - Fast and safe
author: Deepak
tags: [tech, language]
date: "2021-03-07"
thumbnail: ./images/tarsar.jpg
description: Links I found useful about Rust.
---

# Rust - A thread safe and memory safe language close to metal
This post consists of various links and excerpts that I collected while deciding a language for a project that demanded multi-threading capabilities and low latency. Rust was one of the candidates but I did not go ahead with it. Hence, I have no real programming experience in Rust but the links would prove useful to anyone who wants to know more about Rust, it's advantages and disadvantages and use cases.

* [STL](https://doc.rust-lang.org/nightly/std/)
* [Ownership](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html)
* [Socket Programming](https://doc.rust-lang.org/std/net/index.html)

```rust
use std::net::{SocketAddrV4, Ipv4Addr, TcpListener};
use std::io::{Read, Error};

fn main() -> Result<(), Error> {
    let loopback = Ipv4Addr::new(127, 0, 0, 1);
    let socket = SocketAddrV4::new(loopback, 0);
    let listener = TcpListener::bind(socket)?;
    let port = listener.local_addr()?;
    println!("Listening on {}, access this port to end the program", port);
    let (mut tcp_stream, addr) = listener.accept()?; //block  until requested
    println!("Connection received! {:?} is sending data.", addr);
    let mut input = String::new();
    let _ = tcp_stream.read_to_string(&mut input)?;
    println!("{:?} says {}", addr, input);
    Ok(())
}
```

* [Unit testing](https://doc.rust-lang.org/stable/rust-by-example/testing.html)
* [Automated tests](https://doc.rust-lang.org/book/ch11-00-testing.html)
* [Concurrency](https://doc.rust-lang.org/book/ch16-00-concurrency.html)

_By leveraging ownership and type checking, many concurrency errors are compile-time errors in Rust rather than runtime errors. Therefore, rather than making you spend lots of time trying to reproduce the exact circumstances under which a runtime concurrency bug occurs, incorrect code will refuse to compile and present an error explaining the problem._

[Code Samples in Concurrency](https://rust-lang-nursery.github.io/rust-cookbook/concurrency.html)
* Multi-threading
_The `move` closure is often used alongside `thread::spawn` because it allows you to use data from one thread in another thread._

[Threading Model](https://doc.rust-lang.org/std/thread/)
* [Process and Thread binding (to Cores)](https://nitschinger.at/Binding-Threads-And-Processes-to-CPUs-in-Rust/)
* No inheritance, but you can define traits with default implementations which are analogous to abstract classes in C++ having a default function implementation.
* [OOP design pattern](https://doc.rust-lang.org/book/ch17-03-oo-design-patterns.html)
* [Multithreaded web server example](https://doc.rust-lang.org/book/ch20-00-final-project-a-web-server.html)
* [Borrow Checker](https://blog.logrocket.com/introducing-the-rust-borrow-checker/)
* [Ways to implement Linked LIst in Rust](https://rust-unofficial.github.io/too-many-lists/index.html)
* [Rust started codes](https://stevedonovan.github.io/rust-gentle-intro/1-basics.html)
* [gRPC in Rust](https://blog.logrocket.com/rust-and-grpc-a-complete-guide/)
* [Rust vs C++ :  Why C++ is supposedly better?](https://www.viva64.com/en/b/0733/)
* [HFT System in Rust](https://www.reddit.com/r/rust/comments/bhtuah/production_deployment_of_rust_in_hft_system_at/?utm_source=share&utm_medium=web2x)

_Don’t use Rust if you want to get something done quickly. Even with some experience, it’s quite common for me to spend an hour on fixing a single compiler error or data sharing issue that would be a non-issue in something like JavaScript or Python._

_In my experience this is half to do with familiarity with Rust, and half to do with correctness._


##### Things you would likely tweet the day after you start working with Rust
_Fighting the Borrow Checker_

##### Things you would likely tweet the year after you start working with Rust
_Pascal is like wearing a straightjacket, C is like playing with knives, and C++ is juggling flaming chainsaws. In that metaphor, Rust is like doing parkour while suspended on strings & wearing protective gear. Yes, it will sometimes look a little ridiculous, but you'll be able to do all sorts of cool moves without hurting yourself._
