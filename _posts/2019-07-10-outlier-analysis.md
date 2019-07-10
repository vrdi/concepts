---
layout: post
title: Outlier Analysis and Gerrymandering
author: Gabe Schoenbach & Michelle Jones
category: Math
---

## Detecting gerrymandering
Sometimes, we can tell just by looking that something is fishy about a districting plan. But this doesn’t always work.

### Partisan gerrymandering metrics
Many political scientists, mathematicians, and lawyers have created formulas that claim to measure how much a state has been gerrymandered. These **metrics** take in the districting plan of a certain state and output a number. One popular partisan metric is called the “efficiency gap.”

The efficiency gap takes two inputs: the districting plan for a certain state, and voting data from a specific election. Since gerrymanderers want their opponents to waste votes, EG tries to measure the difference between the wasted votes for each party.

What actually counts as a “wasted vote?” In any given district, all the votes for the losing party count as wasted, since the outcome would have been the same had each of those voters skipped the election. For the same reason, any vote for the winning party that was not necessary for the win counts as wasted. I.e., if the winning party received 60% of the vote, 10% of those are considered wasted votes.

(more here)

### The distribution of human heights
Picture this: late one afternoon, an old friend texts you out of the blue and says they’ll tell you how tall they are. You remember their parents were of average height, and they had a pretty unremarkable childhood. You assume they turned out like their parents: a normal height, say 5’ 7”. 

The answer they actually give you? _7 feet._ Of course, you laugh, certain that they’re lying to you.
 
But why are you so sure? For one thing, you probably don’t know anyone who is 7 feet tall. You might have a few friends who are over 6 feet tall, but most of the people you’ve met are somewhere between 5 and 6 feet tall. If you were to plot how many people you know at each height, the picture (called a histogram) would look something like this:

<object type="image/svg+xml" data="{{ "/assets/outlier-analysis/male_female_heights.svg" | relative_url }}">
    <img src="{{ "/assets/outlier-analysis/male_female_heights.svg" | relative_url }}">
</object>


When your friend tells you they’re 7 feet tall, alarm bells start ringing. _I’ve never met anyone taller than 6’ 5”, let alone 7 feet tall! My friend is probably lying…_
 
You decided this because you had **context** for that numerical answer. But if you didn’t know anything about how tall most people are, you would have no idea if your friend was lying. Unlike height, most people don’t have a good sense of their states’ EG’s. For any state, you really have no idea which EG’s are common and which are rare; you couldn’t draw a histogram of state efficiency gaps.
 
To understand which EGs are most common, you’ll need a lot of different districting plans for your state (just like you needed to know many people’s heights in order to understand how rare 7 feet is). Rather than drawing thousands of plans by hand, you can use a computer algorithm called **MCMC** to sample the plans and build a histogram. Try it out below!
