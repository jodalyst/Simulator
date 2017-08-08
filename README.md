<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
<script type="text/x-mathjax-config">
MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});
</script>


# Javascript LTI Simulator

MATLAB and Python both have very nice controls-system packages. Javascript, to my knowledge lacks one, so this is a quick pass at an attempt at one, built on the nice linear algebra package `numeric javascript found http://www.numericjs.com/index.php

The goal of this will be a package that can be readily embedded into online teachign platforms for the purposes of creating learning tools and problem sets/exercises as well as general interest simulation...will this ever be so fast/optimal as to beat MATLAB?  No way.  


### Decisions To Be Made ###

From a functionality perspective, the <a href="http://www.numericjs.com/documentation.html" target="_blank">numeric.js library</a> is very strong. However I don't like its looseness in how it lets one define their matrices. One-row and one-column vectors are ambiguous until used, and it assumes/makes the one that should work in a given situation...so if you were to multiply matrix B times matrix C for some weird reason, it would be fine with that and I don't like that.  

Stylistically, the structure of <a href="http://sylvester.jcoglan.com/api/matrix.html" target="_blank">this library</a> is very nice, but it does lack built-in functionality like eigenvalue calculation.  

Javascript prevents/does not allow operator overloading so we'll never be able to conveniently add to matrices as you can in Python or MATLAB...no solution there ever.


### Objects/Prototypes/Methods:

#### `SS(Ain, Bin, Cin, Din=null, Ein=null, typein = "CT")`: The basic value

* `poles`: 

* `zeros`:

* `ctrb`: 

* `obsv`:

#### `SysSim (sso, Ts, state_out = false)`:
 
#### `rref(M)`: Returns the Reduced Row Echelon Form of the Matrix


#### `rank(M)`: Returns the rank of the matrix




###Specific Demos in Repo

* `base.html`: Simple plotter (from <a href="https://github.com/jodalyst/jinstrument" target="_blank">here</a>) of the progression over time of three states.



### To Do:


* Input and simulate arbitrarily high-order state space systems
* Implement React.js input structure to specify matrices
* Add in a `c2d` converter so folks can input continuous time state space matrices:
    * Determine reliable matrix exponential calculation method (series approximation seems fine, but need to push on it)
* Allow transfer function input and then hidden conversion to state-space form for simulation purposes.
* Allow transfer function inputs in both continuous and discrete time
* Implement the place formula (ackerman's method)
* Implement LQR
* Generate Observability and Controllability Matrices




So let's start with our system in continuous time. First let's establish what the value of $\textbf{x}[n]$ is going to be based off of the continuous time equation for $\textbf{x}(t)$. The value $\textbf{x}[n]$ is matched to the value of $\textbf{x}(nT)$ where $T$ is the sample time of our discrete time system.
$$
\textbf{x}[n] = \textbf{x}(nT) = e^{\textbf{A}nT}\textbf{x}(0) + \int_0^{nT}e^{\textbf{A}\left(nT-\tau\right)}\textbf{B}u\left(\tau\right)d\tau
$$

If you're good with this, then great. If this looks weird, let's quickly break it down...the first term is the natural response of the state space system based only the $\textbf{A}$ matrix in a first-order natural exponent given the starting conditions $\textbf{x}(0)$.  The second term is the convolution integral of our system...as a quick reminder refresher you can think of that part as an infinite sum of infinitely-quick applied inputs ($\textbf{B}u(\tau)$) smeared by the system's impulse response ($e^{\textbf{A}\left(nT-\tau\right)}$) and all summed together with integration.

Anyways by time-shifting by 1 time step to $n+1$ we can arrive at a very similar expression:

$$
\textbf{x}[n+1] = \textbf{x}\left(\left(n+1\right)T\right) = e^{\textbf{A}\left(n+1\right)T}\textbf{x}(0) + \int_0^{\left(n+1\right)T}e^{\textbf{A}\left(\left(n+1\right)T-\tau\right)}\textbf{B}u\left(\tau\right)d\tau
$$
Let's keep our $x[n]$ equation in our pocket for the moment and shuffle and factor some stuff with $x[n+1]$.  First we can factor a $e^{\textbf{A}T}$ from both the part outside the integral and the part inside.
$$
= e^{\textbf{A}T}e^{\textbf{A}nT}\textbf{x}(0) + \int_0^{\left(n+1\right)T}e^{\textbf{A}T}e^{\textbf{A}\left(nT-\tau\right)}\textbf{B}u\left(\tau\right)d\tau
$$
We can then realize that inside the $e^{\textbf{A}T}$ is nothing more than a constant so can be yanked out of the integral like so:
$$
= e^{\textbf{A}T}e^{\textbf{A}nT}\textbf{x}(0) + e^{\textbf{A}T}\int_0^{\left(n+1\right)T}e^{\textbf{A}\left(nT-\tau\right)}\textbf{B}u\left(\tau\right)d\tau
$$
Using that one rule about splitting up integrals that I forget the name of you can then do the following:
$$
= e^{\textbf{A}T}e^{\textbf{A}nT}\textbf{x}(0) + e^{\textbf{A}T}\int_0^{nT}e^{\textbf{A}\left(nT-\tau\right)}\textbf{B}u\left(\tau\right)d\tau+ e^{\textbf{A}T}\int_{nT}^{\left(n+1\right)T}e^{\textbf{A}\left(nT-\tau\right)}\textbf{B}u\left(\tau\right)d\tau
$$
And then let's finally group our non-integral term and one of our integral terms like so:
$$
= e^{\textbf{A}T}\left(e^{\textbf{A}nT}\textbf{x}(0) +\int_0^{nT}e^{\textbf{A}\left(nT-\tau\right)}\textbf{B}u\left(\tau\right)d\tau\right)+ e^{\textbf{A}T}\int_{nT}^{\left(n+1\right)T}e^{\textbf{A}\left(nT-\tau\right)}\textbf{B}u\left(\tau\right)d\tau
$$
If we remember our expression for $x[n]$ from up above we'll notice that the expression inside the parentheses is the exact same as the expression for $x[n]$/$x(nT)$! So we can rephrase as:
$$
\textbf{x}\left(\left(n+1\right)T\right)= e^{\textbf{A}T}\textbf{x}\left(nT\right)+ e^{\textbf{A}T}\int_{nT}^{\left(n+1\right)T}e^{\textbf{A}\left(nT-\tau\right)}\textbf{B}u\left(\tau\right)d\tau
$$

Now at this point we're going to make a decision which allows some assumptions about values.  We'll assume the input to our plant $u(t)$ is a constant from one time step to another. This is the classic "Zero-Order-Hold" which is how our microcontrollers operate. Remember this is not an approximation or anything...it is an assertion! This is actually what is happening. When you set the output of your microcontroller to be 1.5V at timestep $m$ (which corresponds to timepoint $mT$), it remains at that value until timestep $
m+1$ or timepoint $\left(m+1\right)T$.

So now if we assume Zero-Order Hold, that means over the span of the integration, then we can say that our input value is a constant and can therefore be pulled out of the integral. Therefore from $t=nT$ to $t=\left(n+1\right)T$ then $u(t)$ is just $u(nT)$. Same with $\textbf{B}$. Get that thing out of the integral:
$$
\textbf{x}\left(\left(n+1\right)T\right)= e^{\textbf{A}T}\textbf{x}\left(nT\right)+ e^{\textbf{A}T}\left(\int_{nT}^{\left(n+1\right)T}e^{\textbf{A}\left(nT-\tau\right)}d\tau\right)\textbf{B}u\left(nT\right)
$$
If we bring our exponent constant back inside the integral in anticaption of the next step we get this:
$$
\textbf{x}\left(\left(n+1\right)T\right)= e^{\textbf{A}T}\textbf{x}\left(nT\right)+ \left(\int_{nT}^{\left(n+1\right)T}e^{\textbf{A}\left(T+nT-\tau\right)}d\tau\right)\textbf{B}u\left(nT\right)
$$
We can then for the sake of cleanliness respecify the limits/change the variable of integration by investigating what is in the exponent and evaluating:
$$
\left.T+nT-\tau\right|_{\tau = \left(n+1\right)T} = 0
$$
and
$$
\left.T+nT-\tau\right|_{\tau = nT} = T
$$
If we say that$q = T+nT-\tau$ then $dq = -d\tau$...that'll give us:
$$
\textbf{x}\left(\left(n+1\right)T\right)= e^{\textbf{A}T}\textbf{x}\left(nT\right)+ e^{\textbf{A}T}\left(\int_{T}^{0}e^{\textbf{A}q}(-dq)\right)\textbf{B}u\left(nT\right)
$$
and that's ugly so let's flip the direction of our integration with that other integral rule I forget the name of... we could then say that our above expression is:
$$
\textbf{x}\left(\left(n+1\right)T\right)= e^{\textbf{A}T}\textbf{x}\left(nT\right)+ e^{\textbf{A}T}\left(\int_{0}^{T}e^{\textbf{A}q}dq\right)\textbf{B}u\left(nT\right)
$$
What's cool now is to remember that we got into this whole mess since we wanted discrete time representations of our continuous time state space system and we actualy have that now since values evaluated at $(n+1)T$ are our $[n+1]$ values and $nT$ values are our $[n]$ discrete time values. We can then write our the above equation as the following:
$$
\textbf{x}[n+1] = \textbf{A}_d\textbf{x}[n] + \textbf{B}_du[n]
$$
where
$$
\textbf{A}_d = e^{\textbf{A}T}
$$

This thing is actually pretty easy to solve, and with a computational tool at hand, you're all set (and by hand it can be done, but like most stuff with linear algebra, it is great to rely on tools like MATLAB or Python to do the grind for you:

\begin{verbatim}
A_d = expm(A); 
%do not use exp,which gives element-by-element e^
%Only for diagonals is that same thing!!!
\end{verbatim}
We can then also say:
$$
\textbf{B}_d = \left(\int_0^Te^{\textbf{A}q}dq\right)\textbf{B}
$$
This one is a bit more tricky to calculate. In general we can generally build on the fact that:
$$
\left(\int_0^Te^{\textbf{A}q}dq\right)\textbf{A} + \textbf{I} = e^{\textbf{A}T}
$$
which while we won't prove here is analagous to the anti-derivative of an exponential function when you're in standard single-variable calculus.  If $\textbf{A}$ is non-singular (invertible), then we can go ahead and use this relationship to quickly calculate the integral
$$
\int_0^Te^{\textbf{A}q}dq = \textbf{A}^{-1}\left(e^{\textbf{A}T}-1\right)\text{  if }\textbf{A}\text{ is non-singular}
$$
which would then mean (nicely!) that:
$$
\textbf{B}_d = \textbf{A}^{-1}\left(\textbf{A}_d-\textbf{I}\right)\textbf{B}
$$
If $\textbf{A}$ \textit{is} singular (can't be inverted) then we can't do that and need to fall back on the power series expression (which we won't derive here, but can be found in most linear algebra textbooks):
$$
\int_0^Te^{\textbf{A}q}dq = T\left(\textbf{I} + \frac{\textbf{A}T}{2!}+\frac{\left(\textbf{A}T\right)^2}{3!} + \cdots + \frac{\left(\textbf{A}{T}\right)^{m-1}}{m!}+\cdots\right)
$$
This can then be evaluated/used to figure out an answer, but at this point in our journey we can just stand on the shoulders of Giants (MATLAB) and let a computational tool do that part for us. The important part is that we know how it could be done.

\noindent\begin{tikzpicture}
\node [joebox] (box){%
    \begin{minipage}{0.95\textwidth}
Singular $\textbf{A}$ matrices are going to show up when you have things like pure integration in your system.  
   \end{minipage}
};
\end{tikzpicture}%


Also finally, $\textbf{C}$ is easy...if only all of life were like that:
$$
\textbf{C}_d = \textbf{C}
$$
so
$$
y[n] = \textbf{C}_d\textbf{x}[n] 
$$

\textit{Note: If we had the mythical $\textbf{D}$ term involved as well which represents the inputs ability to directly affect the output, which you'll often seen in many state-space textbooks, it would also simply port over like $\textbf{C}$.}

I'd like to stress once again that we made no approximations in this derivation!  The zero-order-hold assertion we made is totally legitimate and very much representative of how the world will actually work.  What we just did is derive an \textit{exact} expression for a discrete time state space model.

But what if we had instead derived it organically (using the sort of discrete time models we messed with in the first few weeks of 6.302?  We'll do it both ways in an example next and see how things pan out:)
