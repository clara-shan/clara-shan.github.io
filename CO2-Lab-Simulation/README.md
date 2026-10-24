## 开发问题记录 & 解决办法
# index.html
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

# logic.js
1. 问题：用e.target.tagName === 'A'判断鼠标直接点到的那个元素是不是 <a> 标签
原因：如果点击的是a标签里面的文字，e.target 是文本节点，文本节点没有 tagName，条件不成立，代码不会执行
解决办法：用 e.target.closest 代替，从点击位置向上找，只要在 a 标签内部，都能拿到 a
2. 问题：点击【结课庆祝 #over】，存在关卡未完成时，导航栏 active 高亮消失
原因：先给点击的 over 链接添加 active → 校验关卡不通过 → 手动删除 over 的 active，导致页面没有任何 active。
解决办法：调换代码执行顺序：点击导航，先拿到目标信息；优先做关卡校验；校验不满足：弹出 toast，直接return，完全不操作 active，保留上一次导航的高亮；校验通过：才移除旧 active，给当前点击链接添加 active，切换页面
3. 问题：可以直接跳过视频，点击导航进入 3D 仿真实验
原因：缺少实验关卡前置校验逻辑
解决办法：增加判断，点击#experiment时，校验stageStatus.video，视频未完成，弹窗提示并 return 拦截跳转
4. 问题：视频看完，点击【下一步】按钮，仅标记 video 状态为 true，不会自动跳实验页面、更新导航 active
原因：next 按钮点击事件只写了stageStatus.video=true，缺少页面切换、导航高亮更新代码
解决办法：next 点击回调内，增加：隐藏所有面板、显示实验面板、移除旧 active，给实验导航添加 active
5. 问题：多处重复写：panels、querySelectorAll、隐藏所有面板、激活导航逻辑
解决办法：抽离公共函数 switchPanel
6.  问题：切换题目时，反馈框 quiz-feedback 不会自动隐藏
原因：showQuestion加载新题目，但是旧的答题反馈框还保持display:flex，需要每次渲染新题目时把它隐藏
解决办法：修改showQuestion函数，在里面加一行：const feedback = document.querySelector('.test-panel .quiz-feedback') feedback.style.display = 'none'
7.  问题：right 和 explanation 两个标签，答对分支没有给 right.innerHTML 赋值，会保留上一题的错误文字。答对的时候，要清空 right，不然上一题 “回答错误” 文字残留
解决办法：right.innerHTML = ''  explanation.innerHTML = ''
8.  问题：每完成一个课程后改变导航栏样式，文字已经是绿色，但底色还是原来 active 的青→紫渐变
原因：原来的选中样式用的是渐变背景（background: linear-gradient(...)，本质是 background-image），而 .done 里只写了纯色 background: rgba(...)，没有把渐变这个 background-image 清掉，渐变就继续显示在上面，盖住了绿色底色。
解决办法：在 .done 规则里强制清掉渐变，修改showQuestion函数，在里面加一行：const feedback = document.querySelector('.test-panel .quiz-feedback') feedback.style.display = 'none' 
9.  问题：写的按钮点击代码找不到石头、找不到气泡，按钮点了啥反应都没有   
原因：不放到 window 箱子里：石头、气泡这些变量只藏在 animate 这一段代码里面
解决办法：把三维模型、材质、实验状态放到全局 window 对象上，在按钮点击等其他代码里，直接控制这个实验的显示和动画，不用复杂传参。

# scene.js
1. 问题：透明液体 opacity:0 依然遮挡仪器、导管，内部结构看不见
原因：透明材质默认写入深度缓冲区，opacity 只是视觉透明，深度测试仍然生效，不等于隐藏
解决办法：不需要显示液体时直接 acidLiquid.visible = false
2. 问题：模型参数调试困难，圆柱几何体上下半径、高度不对，液体和瓶子不贴合
解决办法：反复对照锥形瓶尺寸微调；先用低分段调试，调好再固定分段 32；把所有仪器坐标、尺寸统一基于同一个坐标系原点
3. 问题：使用独立 Mesh 逐个创建气泡，画面卡顿、帧率大幅下降
原因：Mesh 对象开销大，大量网格会产生过多绘制批次，GPU 负载过高
解决办法：改用 BufferGeometry + Points 粒子方案，所有气泡合并为一个绘制对象，减少渲染批次，提升性能
4. 问题：**导气管** 使用独立 Mesh 逐个创建气泡，画面卡顿、帧率大幅下降
原因：Mesh 对象开销大，大量网格会产生过多绘制批次，GPU 负载过高
解决办法：改用 BufferGeometry + Points 粒子方案，所有气泡合并为一个绘制对象，减少渲染批次，提升性能
5. 问题：气泡横向乱跑，X、Z 坐标变化，飘出液体区域
原因：代码错误修改了 X 分量，没有约束横向坐标
解决办法：只修改 Y 轴实现上浮，默认保持 X、Z 不变
6. 问题：鼠标悬浮器材，顶部导航栏往下掉、布局错乱
原因：tooltip 是固定浮层，如果不加这个属性：鼠标一碰到 tooltip 这个 DOM 元素，e.target 就变成 tooltip，触发 closest(header) 判断逻辑，拾取逻辑反复切换、页面 hover 状态紊乱，连带布局样式抖动
解决办法：tooltip 加 pointer-events: none
7. 问题：鼠标悬浮在导气管上没有提示
原因：导气管模型没有绑定 userData
解决办法：tooltip 加 pointer-events: none
8. 问题：数组索引错乱，气泡位置错位、多个气泡坐标互相串位
原因：顶点数组规则为每 3 个一组 x,y,z，循环步长没有使用 i += 3，索引取值逻辑错误
解决办法：循环时 i += 3， i 对应 x，i+1对应 y，i+2对应 z，严格按照三组数据对应一个顶点
9. 问题：导管太长或者太短，反复修改 height 高度后，原来调好的 position 不再适配
原因：导管高度改变，导管中点位置变化，原来校准好的坐标失效
解决办法：先确定导管长度（height），固定高度之后再校准坐标；不要频繁改动高度再调位置