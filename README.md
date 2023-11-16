###### A frog entered your screen hunting down your mouse pointer...  
# Frog Troll

#### A personal trigonometic experiment resulted to this hideous creature.

By adding it to your app, you can append to any element the FrogTroll component.  
This will add a frog to your screen that jumps arround it's parent component boundaries when the mouse pointers comes uncomfortably close to it.  
It turns it's head staring always to the mouse pointer's direction and if the pointer stays still for some time (defined by you), the frog opens its mouth warning about the coming tongue hit.  
If the mouse pointer doesn't get the warning, it will meet the inevitable end as the frog will launch its tongue and make it dissapear from the screen.

## Usage

#### Requirements:  
You just need a [React app](https://react.dev/). The oldest working version of <b>React</b> is <b>16.3</b> where <b>useEffect</b> was introduced.  
#### Installation and Integration:  
To install the Frog Troll run ```npm i --save frog-troll```  

To integrate to your app add ```import {FrogTroll} from 'frog-troll'``` at the top of the component  
you want to have it.  
Then inside the component where you want the Frog Troll to live add ```<FrogTroll options={yourOptions}/>```.  
<b>yourOptions</b> variable is an object whose fields adjust the frog's size, starting position and behaviour:  
<center>

|Field|Type|Default Value|Description|
|-----|----|-------|-----------|
|fontSize|Integer|<nobr>16 if screen width &nbsp;<&nbsp; 1024px<br>19 if screen width >= 1024px<br>20 if screen width >= 1280px</nobr>|Defines the font size used in the parent component|
|size|Integer|5|Defines the size of the frog troll in the units given|
|units|String|'em'|Can be <b>'em'</b> or <b>'px'</b>, defines the units used for the size of the frog troll|
|navbarHeight|Integer|0|The size <b>in pixels</b> of the navbar if there is one*|
|startingPosition|Object|{ x:0, y:0 }|The starting position inside the parent element in the units given in <b>units</b>, giving only <b>positive</b> values. With { x:0, y:0 } being the top left corner of the parent element|
|timeToOpenMouth|Integer|2000|Time in <b>milliseconds</b> from the moment that mouse pointer stops moving to the moment frog troll opens its mouth|
|timeToAttack|Integer|1000|Time in <b>milliseconds</b> from the moment that frog troll opens its mouth to the moment it launches its tongue|
</center>
