const container = document.querySelector('.canvas-container')
const tooltip = document.querySelector('.hover-tooltip')

// 场景，相机，渲染器
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x13151f)

const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 1, 14)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
container.appendChild(renderer.domElement)

// 灯光
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
scene.add(ambientLight)

const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.0)
dirLight1.position.set(6, 12, 8)
scene.add(dirLight1)

const dirLight2 = new THREE.DirectionalLight(0x409eff, 0.5)
dirLight2.position.set(-6, -2, -4)
scene.add(dirLight2)

let controls = null
if (typeof THREE.OrbitControls !== 'undefined') {
  controls = new THREE.OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.maxPolarAngle = Math.PI / 2 - 0.02  // -0.02防止界面抖动或穿模
  controls.target.set(0, 0.2, 0)
  controls.update()
}

// 可交互组   放仪器
const interactiveGroup = new THREE.Group()
scene.add(interactiveGroup)

// 材质
const glassMat = new THREE.MeshPhongMaterial({
  color: 0xd8ecff,
  transparent: true,
  opacity: 0.5,
  side: THREE.DoubleSide,
  depthWrite: false,
  specular: 0xffffff,
  shininess: 260,
  emissive: 0x000000
})

const ironMat = new THREE.MeshStandardMaterial({
  color: 0x22252c,
  roughness: 0.4,
  metalness: 0.5,
  emissive: 0x000000
})

const chromeMat = new THREE.MeshStandardMaterial({
  color: 0xcccccc,
  roughness: 0.2,
  metalness: 0.9,
  emissive: 0x000000
})

const rubberMat = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a,
  roughness: 0.8,
  emissive: 0x000000
})

const woodMat = new THREE.MeshStandardMaterial({
  color: 0xa06c3c,
  roughness: 0.7,
  emissive: 0x000000
})

const reagentBottleMat = new THREE.MeshPhongMaterial({
  color: 0x5a3112,
  transparent: true,
  opacity: 0.92,
  emissive: 0x000000
})

const desk = new THREE.Mesh(
  new THREE.BoxGeometry(16, 0.3, 8),  // y轴方向长0.3，桌子中心到桌面的垂直距离为0.15
  new THREE.MeshStandardMaterial({ color: 0x1c1f26, roughness: 0.5 })
)
desk.position.set(0, -2.15, 0)  // 桌面的y轴坐标为 -2.15+0.15 = -2
scene.add(desk)

const gridHelper = new THREE.GridHelper(18, 18, 0x409eff, 0x2a3140)
gridHelper.position.y = -1.99  // 相对于桌子顶面抬高0.01避免重叠闪
scene.add(gridHelper)

// 锥形瓶
const flaskGroup = new THREE.Group()
flaskGroup.userData = {
  name: "锥形瓶 (发生装置)",
  desc: "250mL 耐高温硼硅玻璃，盛放大理石与反应区"
}

const flaskGlassMat = glassMat.clone()

// 瓶身
const flaskBody = new THREE.Mesh(
  new THREE.CylinderGeometry(0.45, 1.3, 2.3, 32),
  flaskGlassMat
)
flaskBody.position.set(-1, -0.845, 0)  // 瓶底离桌面0.005的距离 解决Z—Fighting

// 瓶颈
const flaskNeck = new THREE.Mesh(
  new THREE.CylinderGeometry(0.45, 0.45, 0.9, 32),
  flaskGlassMat
)
flaskNeck.position.set(-1, 0.755, 0)

// 瓶底
const flaskBottom = new THREE.Mesh(
  new THREE.CylinderGeometry(1.3, 1.3, 0.004, 32),
  flaskGlassMat
)
flaskBottom.position.set(-1, -1.993, 0)

// 刻度贴片
const gradPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(0.6, 1.7),
  new THREE.MeshBasicMaterial({ map: createFlaskGradurationTexture(), transparent: true, side: THREE.DoubleSide })
)
gradPlane.position.set(-1, -1, 0.94)
gradPlane.rotation.x = -0.355;

// 橡胶塞
const flaskRubberMap = rubberMat.clone()

const flaskStopper = new THREE.Mesh(
  new THREE.CylinderGeometry(0.45, 0.4, 0.45, 32),
  flaskRubberMap
)
flaskStopper.position.set(-1, 1.21, 0)

flaskGroup.add(flaskBody, flaskNeck, flaskBottom, gradPlane, flaskStopper)

function createFlaskGradurationTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  // ctx.fillStyle = 'hotpink'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillRect(31, 0, 450, 100)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 50px sans-serif'
  ctx.fillText("BORO 3.3", 145, 70)

  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 5
  const marks = [
    { y: 160, label: "200" },
    { y: 240, label: "150" },
    { y: 320, label: "100" },
    { y: 400, label: "50" }
  ]
  marks.forEach(m => {
    ctx.beginPath()
    ctx.moveTo(130, m.y)
    ctx.lineTo(280, m.y)
    ctx.stroke()
    ctx.fillText(m.label, 300, m.y + 15)
  })

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.NearestFilter
  return texture
}

// 大理石试剂瓶标签
function createMarbleLabelTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 512, 256)
  ctx.strokeStyle = '#d32f2f'
  ctx.lineWidth = 8
  ctx.strokeRect(10, 10, 492, 236)

  ctx.fillStyle = '#111111'
  ctx.font = 'bold 34px sans-serif'
  ctx.fillText('大理石(碳酸钙)', 150, 65)
  ctx.font = 'bold 20px sans-serif'
  ctx.fillText('Calcium Carbonate  AR (分析纯)', 110, 100)
  ctx.fillText('化学式: CaCO₃      相对分子质量: 100.09', 80, 140)
  ctx.fillText('CAS号: 471-34-1    净含量: 500g', 110, 180)

  ctx.fillStyle = '#d32f2f'
  ctx.fillRect(10, 205, 492, 40)
  ctx.fillStyle = '#ffffff'
  ctx.fillText('规范存储 | 密闭防潮 | 远离酸类', 120, 232)

  return new THREE.CanvasTexture(canvas)
}

// 铁架台
const standGroup = new THREE.Group()
standGroup.userData = {
  name: "铁架台装置",
  desc: "固定发生装置与锥形瓶颈部"
}
const standBaseMat = ironMat.clone()

// 底座
const standBase = new THREE.Mesh(
  new THREE.BoxGeometry(2.4, 0.05, 2.6),
  standBaseMat
)
standBase.position.set(-3.55, -1.97, 0)

// 立柱
const standRot = new THREE.Mesh(
  new THREE.CylinderGeometry(0.07, 0.07, 5, 32),
  chromeMat.clone()
)
standRot.position.set(-3.55, 0.55, 0)

// 十字滑块
const crossClamp = new THREE.Mesh(
  new THREE.BoxGeometry(0.25, 0.25, 0.25),
  standBaseMat
)
crossClamp.position.set(-3.55, 0.9, 0)

// 手拧螺旋
const boltKnob = new THREE.Mesh(
  new THREE.CylinderGeometry(0.04, 0.04, 0.5, 32),
  chromeMat.clone()
)
boltKnob.position.set(-3.55, 0.9, 0.125)
boltKnob.rotation.x = Math.PI / 2

// 横杆
const clampArm = new THREE.Mesh(
  new THREE.CylinderGeometry(0.04, 0.04, 1.92, 32),
  chromeMat.clone()
)
clampArm.position.set(-2.4, 0.9, 0)
clampArm.rotation.z = Math.PI / 2

// 铁夹
const clampJaw = new THREE.Mesh(
  new THREE.TorusGeometry(0.45, 0.04, 12, 32, Math.PI * 1.2),
  standBaseMat
)
clampJaw.position.set(-1, 0.9, 0)
clampJaw.rotation.x = Math.PI / 2

standGroup.add(standBase, standRot, crossClamp, boltKnob, clampArm, clampJaw)

// 长颈漏斗
const funnelGroup = new THREE.Group()
funnelGroup.userData = {
  name: "长颈漏斗",
  desc: "注入稀盐酸，下端管口必须浸入液面形成液封"
}
const funnelGlassMat = glassMat.clone()

const funnelStem = new THREE.Mesh(
  new THREE.CylinderGeometry(0.04, 0.04, 3.6, 32, true),
  funnelGlassMat
)
funnelStem.position.set(-1.2, 0.7, 0)

const funnelBowl = new THREE.Mesh(
  new THREE.CylinderGeometry(0.7, 0.05, 0.8, 32, true),
  funnelGlassMat
)
funnelBowl.position.set(-1.2, 2.9, 0)

// 稀盐酸水流
const acidStreamMat = new THREE.MeshBasicMaterial({
  color: 0x81d4fa,
  transparent: true,
  opacity: 0
})

const acidStream = new THREE.Mesh(
  new THREE.CylinderGeometry(0.035, 0.035, 3.6, 32),
  acidStreamMat
)
acidStream.position.set(-1.2, 0.7, 0)
funnelGroup.add(funnelStem, funnelBowl, acidStream)

// 大理石试剂瓶
const marbleBottleGroup = new THREE.Group()
marbleBottleGroup.userData = {
  name: "大理石试剂瓶",
  desc: "盛装碳酸钙固体碎屑 (CaCO₃)，分析纯化学试剂"
}
const marbleBottleMat = reagentBottleMat.clone()

const marbleBottleBody = new THREE.Mesh(
  new THREE.CylinderGeometry(0.8, 0.8, 1.5, 32),
  marbleBottleMat
)
marbleBottleBody.position.set(-5.6, -1.235, 0)

const labelPlane = new THREE.Mesh(
  new THREE.CylinderGeometry(0.8, 0.8, 0.9, 32, 1, true, -Math.PI * 0.45, Math.PI * 0.9),
  new THREE.MeshBasicMaterial({
    map: createMarbleLabelTexture(),
    side: THREE.FrontSide
  })
)
labelPlane.position.set(-5.6, -1.235, 0.03)

const marbleCap = new THREE.Mesh(
  new THREE.CylinderGeometry(0.6, 0.6, 0.3, 32),
  ironMat.clone()
)
marbleCap.position.set(-5.6, -0.335, 0)
marbleBottleGroup.add(marbleBottleBody, labelPlane, marbleCap)

// 试管架
const rackGroup = new THREE.Group()
rackGroup.userData = {
  name: "木质试管架",
  desc: "放置固定检验试管与实验后晾干"
}
const rackMat = woodMat.clone()

const rackDown = new THREE.Mesh(
  new THREE.BoxGeometry(3.5, 0.2, 0.5),
  rackMat
)
rackDown.position.set(4.5, -1.66, 0)

const rackSideL = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 2.5, 0.5),
  rackMat
)
rackSideL.position.set(2.65, -0.745, 0)

const rackSideR = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 2.5, 0.5),
  rackMat
)
rackSideR.position.set(6.45, -0.745, 0)

const rackUp = new THREE.Mesh(
  new THREE.BoxGeometry(3.5, 0.2, 0.5),
  rackMat
)
rackUp.position.set(4.5, -0.5, 0)
rackGroup.add(rackDown, rackSideL, rackSideR, rackUp)

// 试管
const testTubeGroup = new THREE.Group()
testTubeGroup.userData = {
  name: "检验试管",
  desc: "盛装澄清石灰水，通入二氧化碳后观察乳白沉淀反应"
}
const tubeMat = glassMat.clone()
const tubeFlask = rubberMat.clone()

const testTubeL = new THREE.Mesh(
  new THREE.CylinderGeometry(0.25, 0.25, 2.6, 32),
  tubeMat
)
testTubeL.position.set(3.7, -0.359, 0)

const flaskL = new THREE.Mesh(
  new THREE.CylinderGeometry(0.25, 0.2, 0.3, 32),
  tubeFlask
)
flaskL.position.set(3.7, 0.941, 0)

const testTubeR = new THREE.Mesh(
  new THREE.CylinderGeometry(0.25, 0.25, 2.6, 32),
  tubeMat
)
testTubeR.position.set(5.4, -0.359, 0)

const flaskR = new THREE.Mesh(
  new THREE.CylinderGeometry(0.25, 0.2, 0.3, 32),
  tubeFlask
)
flaskR.position.set(5.4, 0.941, 0)
testTubeGroup.add(testTubeL, testTubeR, flaskL, flaskR)

// 澄清石灰水
const limeWaterMat = new THREE.MeshStandardMaterial({
  color: 0x81d4fa,
  transparent: true,
  opacity: 0.55
})
const limeWater = new THREE.Mesh(new THREE.CylinderGeometry(0.249, 0.249, 1.5, 32), limeWaterMat)
limeWater.position.set(3.7, -0.908, 0)
scene.add(limeWater)

// 导气管
const deliveryTubeGroup = new THREE.Group()
deliveryTubeGroup.userData = {
  name: "橡胶导气管",
  desc: "输送反应生成的二氧化碳，将气体导入澄清石灰水试管中"
}

const deliveryTube = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-0.8, -0.4, 0),
  new THREE.Vector3(-0.8, 2, 0),
  new THREE.Vector3(-0.7, 2.3, 0),
  new THREE.Vector3(3.5, 2.3, 0),
  new THREE.Vector3(3.7, 2, 0),
  new THREE.Vector3(3.7, 0.4, 0)
])
const tube = new THREE.TubeGeometry(deliveryTube, 64, 0.04, 16, false)
const gasDeliveryTube = new THREE.Mesh(tube, glassMat.clone())
deliveryTubeGroup.add(gasDeliveryTube)

interactiveGroup.add(flaskGroup, standGroup, funnelGroup, marbleBottleGroup, rackGroup, testTubeGroup, deliveryTubeGroup)

// 大理石
const stoneGroup = new THREE.Group()
for (let i = 0; i < 14; i++) {
  const stone = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.16),
    new THREE.MeshStandardMaterial({
      color: 0x7d8284,
      roughness: 0.9
    }),
  )
  stone.position.set(-1 + (Math.random() - 0.5) * 1.2, -1.993, (Math.random() - 0.5) * 1.2),
    stoneGroup.add(stone)
}
stoneGroup.visible = false
scene.add(stoneGroup)

// 稀盐酸
const acidLiquidMat = new THREE.MeshStandardMaterial({
  color: 0x90caf9,
  transparent: true
})
const acidLiquid = new THREE.Mesh(
  new THREE.CylinderGeometry(0.449, 1.29, 2.29, 32),
  acidLiquidMat
)
acidLiquid.position.set(-1, -0.845, 0)
acidLiquid.visible = false
scene.add(acidLiquid)

// 气泡
const bubble = new THREE.BufferGeometry()
const bubbleCount = 45
const bubblePos = new Float32Array(bubbleCount * 3)
for (let i = 0; i < bubbleCount * 3; i += 3) {
  bubblePos[i] = -1 + (Math.random() - 0.5) * 1.2
  bubblePos[i + 1] = -1.993 + Math.random() * 1
  bubblePos[i + 2] = (Math.random() - 0.5) * 1.2
}
bubble.setAttribute('position', new THREE.BufferAttribute(bubblePos, 3))
const bubbleMat = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.12,
  transparent: true,
  opacity: 0.9
})
const bubbleParticles = new THREE.Points(bubble, bubbleMat)
bubbleParticles.visible = false
scene.add(bubbleParticles)

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
let currentHoveredGroup = null

// 判断鼠标碰到的是不是一个完整的实验器材
function findInteractableParent(obj) {
  while (obj && obj !== scene && obj !== interactiveGroup) {
    if (obj.userData && obj.userData.name) return obj
    obj = obj.parent
  }
  return null
}

// 监听鼠标
window.addEventListener('mousemove', e => {
  // 鼠标不是放在仪器上就不显示
  if (e.target.closest('header') || e.target.closest('.teach-panel') || e.target.closest('.experiment-panel') || e.target.closest('.setting')) {
    tooltip.style.display = 'none'
    return
  }
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(interactiveGroup.children, true)
  if (intersects.length > 0) {
    const targetGroup = findInteractableParent(intersects[0].object)
    if (targetGroup) {
      tooltip.style.display = 'block'
      tooltip.style.left = `${e.clientX}px`
      tooltip.style.top = `${e.clientY}px`
      tooltip.innerHTML = `
      <div class="tip-title">${targetGroup.userData.name}</div>
      <div class="tip-desc">${targetGroup.userData.desc}</div>
      `
      return
    }
  }
  document.body.style.cursor = 'default';
  tooltip.style.display = 'none';
})

// 全局状态 动画循环
window.ambientLight = ambientLight
window.stoneGroup = stoneGroup
window.bubbleParticles = bubbleParticles
window.limeWaterMat = limeWaterMat
window.acidLiquidMat = acidLiquidMat
window.acidStreamMat = acidStreamMat
window.isReacting = false
window.gasVolume = 0

function animate() {
  requestAnimationFrame(animate)
  if (controls) controls.update()

  if (window.isReacting) {
    window.gasVolume = Math.min(250, window.gasVolume + 0.4)
    const production = document.querySelector('.production')
    if (production) production.innerHTML = `${Math.floor(window.gasVolume)}`
    if (window.bubbleParticles && window.bubbleParticles.geometry) {
      const positions = window.bubbleParticles.geometry.attributes.position.array
      for (let i = 0; i < bubbleCount * 3; i += 3) {
        positions[i + 1] += 0.03
        if (positions[i + 1] > -0.8) positions[i + 1] = -1.993
      }
      window.bubbleParticles.geometry.attributes.position.needsUpdate = true
    }
  }

  renderer.render(scene, camera)
}
animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})