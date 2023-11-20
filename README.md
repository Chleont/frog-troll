###### A frog entered your screen hunting down your mouse pointer...  
# Frog Troll

#### A personal trigonometic experiment resulted to this hideous creature.

By adding it to your app, you can append to any element the FrogTroll component.  
This will add a frog to your screen that jumps arround it's parent component boundaries when the mouse pointers comes uncomfortably close to it.  
It turns it's head staring always to the mouse pointer's direction and if the pointer stays still for some time (defined by you), the frog opens its mouth warning about the coming tongue hit.  
If the mouse pointer doesn't get the warning, it will meet the inevitable end as the frog will launch its tongue and make it dissapear from the screen.  

![](https://i.imgur.com/MygEPYW.gif)
## Usage

#### Requirements:  
You just need a [React app](https://react.dev/). The oldest working version of <b>React</b> is <b>16.3</b> where <b>useEffect</b> was introduced.  
#### Installation and Integration:  
To install the Frog Troll run ```npm i --save frog-troll```  

To integrate to your app add ```import {FrogTroll} from 'frog-troll'``` at the top of the component you want to have it.  
Then inside the component where you want the Frog Troll to live add ```<FrogTroll options={yourOptions}/>```.  

<p align="center"><pre style="textAlign:center">Make sure to include options even as an empty parameter <b>options={{}}</b></pre></p>
<br>
<b>yourOptions</b> variable is an object whose fields adjust the frog's size, starting position and behaviour:  
<center>

|Field|Type|Default Value|Description|
|-----|----|-------|-----------|
|fontSize|Integer|16&nbsp;if&nbsp;screen&nbsp;width&nbsp;&nbsp;<&nbsp;&nbsp;1024px<br>19&nbsp;if&nbsp;screen&nbsp;width&nbsp;>=&nbsp;1024px<br>20&nbsp;if&nbsp;screen&nbsp;width&nbsp;>=&nbsp;1280px|Defines the font size used in the parent component|
|size|Integer|5|Defines the size of the frog troll in the units given|
|units|String|'em'|Can be <b>'em'</b> or <b>'px'</b>, defines the units used for the size of the frog troll|
|navbarHeight|Integer|0|The size <b>in pixels</b> of the navbar if there is one*|
|startingPosition|Object|{ x:0, y:0 }|The starting position inside the parent element in the units given in <b>units</b>, giving only <b>positive</b> values. With { x:0, y:0 } being the top left corner of the parent element|
|timeToOpenMouth|Integer|2000|Time in <b>milliseconds</b> from the moment that mouse pointer stops moving to the moment frog troll opens its mouth|
|timeToAttack|Integer|1000|Time in <b>milliseconds</b> from the moment that frog troll opens its mouth to the moment it launches its tongue|
</center>

## Geometry


The frog troll feels uncomfortable when the pointer tries to touch it so it jumps to a random ```(x,y)``` point within the boundaries of the parent element.  
Most of the magic happens in the ```jump()``` function where the orbit of the frog troll's jump is calculated.  
The un-natural convention has been made that the jump follows always a perfect circle and based on this theory, we have eight cases of jumps. Considering that the starting position of the frog troll is ```(0,0)```, depending on the spot of the final position the eight cases are shown below.

<p align="center" style="width:100%;">
    <img src="https://i.imgur.com/Rw6TTcW.png" alt="Jump cases" style="width:50%;"/>
    <br>
    <i>Jump Cases</i>
</p>
<br>  

* In cases <b>a</b> and <b>h</b>, the center of the frog troll's orbit circle will be on <b>Xaxis</b> (<i>Case 1</i>).<br>  
* In cases <b>f</b> and <b>c</b>, the center of the frog troll's orbit circle will be on <b>Yaxis</b> (<i>Case 4</i>).<br>
* In cases <b>g</b> and <b>b</b>, the center of the frog troll's orbit circle will be on the line <b>passing from final position<br>point and being parallel to Yaxis</b> (<i>Case 3</i>).<br>
* In cases <b>e</b> and <b>d</b>, the center of the frog troll's orbit circle will be on the line <b>passing from final position<br>point and being parallel to Xaxis</b> (<i>Case 2</i>).<br>

<br>
<table align="center">
    <tr>
        <td><img alt="case1" src="https://i.imgur.com/UKHTXw1.png"></td>
        <td><img alt="case2" src="https://i.imgur.com/UNHcatS.png"></td>
    </tr> 
    <tr align="center">
        <td><i>Case 1</i></td>
        <td><i>Case 2</i></td>
    </tr>
    <tr table align="center">
        <td><img alt="case3" align="center "width=60% height=60% src="https://i.imgur.com/nSvx7vk.png"></td>
        <td><img alt="case4" align="center" width=60% height=60% src="https://i.imgur.com/fLGqaCQ.png"></td>
    </tr> 
    <tr align="center">
        <td><i>Case 3</i></td>
        <td><i>Case 4</i></td>
    </tr>
</table>
