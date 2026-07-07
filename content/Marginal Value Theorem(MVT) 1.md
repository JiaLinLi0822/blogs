[Marginal Value Theorem]([https://www.sciencedirect.com/science/article/pii/004058097690040X](https://www.sciencedirect.com/science/article/pii/004058097690040X))

We define as follows:
- $P_i$ = proportion of the visited patches that are of type i (i = 1, 2,..., K).
- $E_T$ = energy cost per unit time in traveling between patches.
- $E_{si}$ = energy cost per unit time while searching in a patch of type i.
- $h_i(T)$ = assimilated energy from hunting for T time units’ in a patch of type i minus all energy costs except the cost of searching.
- $g_i(T) = h_i(T) - E_{si} \cdot T$ = assimilated energy corrected for the cost of searching.

The time for a predator to use a single patch is the interpatch travel time (t) plus the time in the patch. Let $T_u$, be the average time to use one patch.
$$
T_u = t + \sum P_i \cdot T_i .
$$
T is now written as $T_i$ to indicate that it may be different for each patch type.
The average energy from a patch is $E_e$.
$$
E_e = \sum P_i \cdot g_i(T_i).
$$
The net energy intake rate (En) is given by:
$$
En = \frac{E_e - t \cdot E_T}{T_u}
$$
En may thus be written as
$$
En = \frac{\sum P_i \cdot g_i(T_i) - t \cdot E_T}{t + \sum P_i \cdot T_i}
$$


The predator should leave the patch it is presently in when the marginal capture rate in the patch ($\partial g/\partial T$) drops to the average capture rate for the habitat.


$$
\boxed{ \text{离开资源点的最优时机：当即时边际收益 } \frac{dG(t)}{dt} = \frac{G(t)}{t + T_{travel}} }
$$
