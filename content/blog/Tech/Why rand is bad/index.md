---
title: Why rand() is bad?
author: Deepak
tags: [tech, language, C++]
date: "2021-05-20"
thumbnail: ./images/jared-poledna.jpg
description: Why you should not use rand() and use <random>
---

#### Notation : 
* _[a, b] - implies the range of integers from a to b inclusive._
* _LGC - Linear Congruential Generators_


## Using rand()
Let's give an example of generating 16 numbers in the range [0, 99].
```cpp
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main()
{
    srand(time(NULL));
    for (int i = 0; i < 16; ++i)
        printf("%d", rand() % 100);
    printf("\n");
}
```
A seemingly innocuous code with no visible syntactical or logical fallacies. Let's dive into each one of the functions and variables.

* `time(NULL)` : 
    1. In C (and also C++), `NULL` is `0` and it's an integer. Hence, it has a high tendency to cause unintended function overloads and lead to ambiguous code. Use `nullptr` instead(from C++11).
    2. `time` runs once every second. Run the code more than once in a second, and now you can replicate the seed.
* `srand(time(NULL))` : `time()` returns a 64-bit `time_t`, while `srand()` accepts 32-bit `unsigned int`. Hence, a loss of precision here and potentially vulnerable.
* `rand()` : 
    1. It has a range of [0, 32767] (2<sup>15</sup>-1). That is awfully small for several use cases today. For instance, you cannot sample data from a dataset of size > 32767 and we deal with hundreds of thousands of data rows easily. 
    2. it uses [Linear Congruential Generators](https://en.wikipedia.org/wiki/Linear_congruential_generator) for pseudo-random number generation and if the parameters, namely modulus(`m`), multiplier(`a`) and increment(`c`) do not obey [certain conditions](https://en.wikipedia.org/wiki/Linear_congruential_generator#Period_length), the generated numbers do not acheive a periodicity of `m` and hence, not a uniform distribution.
    3. In higher dimensions, LGCs lie on well-defined hyperplanes([Marsaglia's Theorem](https://en.wikipedia.org/wiki/Marsaglia%27s_theorem)). Not something you want in an internet facing code.
* `rand()%100` : `rand()` has a range of [0, 32767]. The length is not a multiple of 100 and if you split the range into buckets of 100, you get 32700 buckets of equal length 100 and one incomplete bucket of length 68 i.e.[0, 67]. Repeat the numbers long enough and the frequency of the first 68 numbers will be higher than the rest.

---
## Introducing \<random\>
Starting from C++11, provides the `random` header which hosts and bunch of random distributions and clean way to draw samples from them as well.
The distributions I tend to encounter most are :
```
uniform_int_distribution
uniform_real_distribution
bernoulli_distribution
poisson_distribution
normal_distribution
```

Complete list available [here](https://www.cplusplus.com/reference/random/).

Coming back to the pseudo-random number generation problem, our task is to draw integer samples from a uniform distribution in the range `[0, 99]`.
This time we can use `uniform_int_distribution`.
To draw samples from the above distribution, we need to provide a Random Number Engine (LGC being one). This time, instead of LGC, we use [`mersenne_twister_engine`](https://www.cplusplus.com/reference/random/mersenne_twister_engine/). Further, unlike `srand()` to set a seed, let's use [`random_engine`](https://en.cppreference.com/w/cpp/numeric/random/random_device) which produces uniformly distributed non-deterministic random numbers.

The new code snippet is as follows:
```cpp
#include <random>
#include <iostream>

int main()
{
    std::random_device rd;
    std::mt19937 mt(rd()); // Can be supplied with static seeds like any non-negative integral value
    std::uniform_real_distribution<double> dist(0, 99);

    for (int i = 0; i < 16; ++i)
        std::cout << dist(mt) << "\n";
}
```

We'll start with `std::mt19937` first and come to `random_device` later.

* `std::mt19937` : 
    1. Creates a random number generation engine based on [Mersenne Twister Algorithm](https://en.wikipedia.org/wiki/Mersenne_twister)
    2. Its periodicity is 2<sup>19937</sup> i.e. its range is [0, 2<sup>19937</sup>-1]. That's absolutely massive.
    3. It is faster than true random methods (like `random_device` which relly on hardware devices)
    4. Passes several statistical tests for randomness including [Diehard Tests](https://en.wikipedia.org/wiki/Diehard_tests).
    5. Not cryptographically secure.
* `std::uniform_real_distribution<double> dist(a, b)` : 
    1. Passing the engine to dist, we want numbers in the range [a, b].
    2. Works on `signed/unsigned short/int/long/long long`, but not on `char`.
* `std::random_device` : 
    1. Can be used to set 32-bit and higher seeds.
    2. It is non-seedable and hence non-reproducible.
    3. It is slower than Mersenne-Twister.


##### *Acknowledgement*
The code-snippets and analysis have been derived from the [talk by Stephan T. Lavavej](https://channel9.msdn.com/Events/GoingNative/2013/rand-Considered-Harmful) and the intention of this article is to provide an abridged version in readable format for future reference.