// 1. 十道经典选择题
const quizList = [
  {
    question: "1. 实验室制取二氧化碳最适宜选用的药品组合是？",
    options: ["A. 碳酸钠粉末与稀盐酸", "B. 大理石(石灰石)与稀盐酸", "C. 大理石与稀硫酸", "D. 木炭在氧气中燃烧"],
    answer: 1,
    explanation: "大理石与稀盐酸反应速率适中，便于收集；碳酸钠反应过快，稀硫酸会生成微溶的 CaSO₄ 阻碍反应。"
  },
  {
    question: "2. 在向锥形瓶中加入药品时，正确的操作顺序是？",
    options: ["A. 先注入稀盐酸，后加大理石", "B. 先加大理石，后注入稀盐酸", "C. 必须同时加入", "D. 没有任何先后要求"],
    answer: 1,
    explanation: "遵循‘先固后液’原则，防止液体飞溅造成危险或反应过早不可控。"
  },
  {
    question: "3. 实验装置中长颈漏斗下端管口必须伸入液面以下，其主要目的是？",
    options: ["A. 加快稀盐酸反应速度", "B. 防止生成的 CO₂ 气体从长颈漏斗逸出", "C. 便于观察液体流动", "D. 降低反应温度"],
    answer: 1,
    explanation: "液面封住管口（液封），气体只能从上方导管流出。"
  },
  {
    question: "4. 实验室收集二氧化碳气体通常采用的方法是？",
    options: ["A. 排水法", "B. 向下排空气法", "C. 向上排空气法", "D. 排水法或向上排空气法均可"],
    answer: 2,
    explanation: "CO₂ 密度比空气大且能溶于水，因此最适宜采用向上排空气法。"
  },
  {
    question: "5. 检验集气瓶中的二氧化碳是否已经收集满，正确的方法是？",
    options: ["A. 将燃着的木条伸入集气瓶底部", "B. 将燃着的木条放在集气瓶口", "C. 倒入澄清石灰水并振荡", "D. 用带火星的木条伸入瓶中"],
    answer: 1,
    explanation: "验满必须在‘瓶口’操作，木条熄灭说明二氧化碳已经逸满溢出。"
  },
  {
    question: "6. 检验所收集的气体是否为二氧化碳，应选用的试剂是？",
    options: ["A. 紫色石蕊溶液", "B. 澄清石灰水", "C. 蒸馏水", "D. 氢氧化钠溶液"],
    answer: 1,
    explanation: "CO₂ 通入澄清石灰水会产生特征明显的乳白色沉淀，是检验 CO₂ 的专属标准方法。"
  },
  {
    question: "7. 澄清石灰水变浑浊所生成的沉淀物化学式是？",
    options: ["A. CaCl₂", "B. Ca(HCO₃)₂", "C. CaCO₃", "D. CaO"],
    answer: 2,
    explanation: "Ca(OH)₂ + CO₂ = CaCO₃↓ + H₂O，白色沉淀即碳酸钙。"
  },
  {
    question: "8. 为什么不能用浓盐酸代替稀盐酸来制取二氧化碳？",
    options: ["A. 浓盐酸反应太慢", "B. 浓盐酸具有挥发性，会使气体混入 HCl 杂质", "C. 浓盐酸不与大理石反应", "D. 会发生爆炸"],
    answer: 1,
    explanation: "浓盐酸挥发出的氯化氢气体会严重污染收集到的 CO₂ 纯度。"
  },
  {
    question: "9. 组装好气体发生装置后，在加药品前必须首先进行的操作是？",
    options: ["A. 检查装置气密性", "B. 润湿仪器", "C. 倒入清洗水", "D. 称量药品重量"],
    answer: 0,
    explanation: "制气装置必须第一步检查气密性，否则漏气会导致实验失败甚至药品浪费。"
  },
  {
    question: "10. 下列关于二氧化碳性质的叙述，错误的是？",
    options: ["A. 通常情况下二氧化碳不能燃烧也不支持燃烧", "B. 二氧化碳能溶于水", "C. 二氧化碳有毒，吸入即致命", "D. 固态二氧化碳俗称‘干冰’"],
    answer: 2,
    explanation: "二氧化碳本身无毒，但不能供给呼吸，高浓度时会使人窒息。"
  }
];

// 头部导航区域
// 关卡状态
const stageStatus = {
  video: false,
  experiment: false,
  test: false,
  review: false
}

const stageName = {
  video: '1. 视频教学',
  experiment: '2. 3D仿真实验',
  test: '3. 知识小测验',
  review: '4. 知识回顾'
}

let toastTimer = null

// toast弹窗工具函数：弹出警告提示
function showToast(msg) {
  const toast = document.querySelector('.toast-msg')
  if (!toast) return
  const toastP = toast.querySelector('p:last-child')
  toastP.innerHTML = `${msg}`
  toast.style.display = 'block'
  clearTimeout(toastTimer)
  toastTimer = setTimeout(function () {
    toast.style.display = 'none'
  }, 1500)
}

// 公共页面切换函数
function switchPanel(targetId) {
  const ul = document.querySelector('nav ul')
  const oldActive = ul.querySelector('.active')
  if (oldActive) oldActive.classList.remove('active')
  const targetA = document.querySelector(`a[href="${targetId}"]`);
  if (targetA) targetA.classList.add('active');

  const panels = document.querySelectorAll('#video,#experiment,#test,#review,#over')
  panels.forEach(panel => panel.style.display = 'none')
  const targetPanel = document.querySelector(targetId)
  if (targetPanel) targetPanel.style.display = 'flex'
}

// 公共页面显示警告提示
function mustDo() {
  let mustDo = []
  if (!stageStatus.video) mustDo.push(stageName.video)
  if (!stageStatus.experiment) mustDo.push(stageName.experiment)
  if (!stageStatus.test) mustDo.push(stageName.test)
  if (!stageStatus.review) mustDo.push(stageName.review)
  if (mustDo.length > 0) {
    showToast(`${mustDo.join('、')}`)
  }
}

function jumpToStage() {
  // 关卡自由跳转
  const ul = document.querySelector('nav ul')
  ul.addEventListener('click', function (e) {
    const targetA = e.target.closest('a')   // 从当前点击的元素，向上一层层找父元素，看外面有没有包裹着 <a>
    if (!targetA) return

    e.preventDefault()

    // 防跳关
    const targetId = targetA.getAttribute('href')
    const hrefMap = {
      "#video": "video",
      "#experiment": "experiment",
      "#test": "test",
      "#review": "review",
      "#over": "over"
    }

    const key = hrefMap[targetId]

    if (key === 'over') {
      mustDo()
      return
    }

    const oldActive = ul.querySelector('.active')
    if (oldActive) oldActive.classList.remove('active')
    targetA.classList.add('active')

    const panels = document.querySelectorAll('#video,#experiment,#test,#review,#over')
    panels.forEach(panel => panel.style.display = 'none')
    const targetPanel = document.querySelector(targetId)
    targetPanel.style.display = 'flex'
  })

  // 设置按钮
  const setting = document.querySelector('header .btn-setting')
  const setPanel = document.querySelector('main .setting')
  setting.addEventListener('click', () => {
    setPanel.style.display = 'flex'
  })

  const closeBtn = document.querySelector('.setting .header span')
  closeBtn.addEventListener('click', () => {
    setPanel.style.display = 'none'
  })

  // 判断视频有没有看完，看完视频才能点击按钮
  const next = document.querySelector('.teach-panel .btn-next')
  const video = document.querySelector('.teach-panel video')
  if (next && video) {
    next.disabled = true
    video.addEventListener('ended', function () {
      next.disabled = false
    })
    next.addEventListener('click', function () {
      stageStatus.video = true
      switchPanel('#experiment')
    })
  }

  // 点击按钮进入结课页面
  const review = document.querySelector('.teach-panel .btn-review')
  review.addEventListener('click', function () {
    // 判断前面课程是否全部完成
    if (!stageStatus.video && !stageStatus.experiment) showToast(`${mustDo().join('、')}`)

    stageStatus.review = true
    switchPanel('#over')
  })

  // 点击按钮重新体验课程
  const retry = document.querySelector('.teach-panel .btn-retry')
  retry.addEventListener('click', () => {
    location.reload()
  })
}

// 测试题系统


window.addEventListener('DOMContentLoaded', function () {
  jumpToStage();
})

