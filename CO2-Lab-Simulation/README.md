## 开发问题记录 & 解决办法
1. 问题：ul内部的文字贴顶
原因：header使用了line—height，无法自由设置li的高度，如果不让li的高度充满ul，li里面的文字就会只在顶部
解决方案：把行高换成侧轴垂直居中,子元素不需要撑满父盒子高度(不用给header里的每一个部分都设置height：100%)，只要子元素自身有内容高度，flex 就会自动把它放到垂直中间。
2. 问题：在.step-panel不知道该怎么让里面的内容垂直居中
解决办法：给.step-panel开启flex，把侧轴转变为主轴，子元素垂直从上往下排列，再用主轴方向居中(通过 gap 给子元素和子元素之间设置间距)
3. 问题：进行相对定位时文字被顶出屏幕
原因：main盒子没有设置高度，teach.panel设置相对定位后脱离文档流，内容由experimen-panel盒子撑开所以设置的top:50%就不是屏幕中间而是experimen-panel盒子的中间
解决办法：height: calc(100vh - 70px);  100vh表示当前可视区完整高度，70px是header的高度，calc() 让CSS直接做加减乘除运算
4. 问题：想让experime-panel里的两个面板高度由内容撑开，但左边高度被拉伸到和右边盒子一样高了
原因：experimen-panel盒子使用了flex布局，侧轴默认align-items：stretch；这会让子元素拉伸填满父容器的高度
解决办法：align-items：flex-start；子元素靠顶部对齐，不拉伸，盒子高度由自己内容撑开




