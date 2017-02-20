/**
 * slider滑动组件
 * 2017-2-19
 */
class Slider {
	constructor(options) {
		this.wrap = options.dom
		this.dataList = options.dataList

		this.init()
		this.renderDOM()
		this.bindDOM()
	}

	init() {
		this.radio = window.innerHeight/window.innerWidth
		this.pageWidth = window.innerWidth
		this.index = 0
	}

	renderDOM() {
		let wrap = this.wrap
		let dataList = this.dataList
		let len = dataList.length

		this.outer = document.createElement('ul')
		for(let i=0; i<len; i++) {
			let oLi = document.createElement('li')
			let item = dataList[i]
			oLi.style.width = `${window.innerWidth}px`
			oLi.style.webkitTransform = `translate3d(${i*this.pageWidth}px, 0, 0)`
			if(item) {
				if(item['height']/item['width'] > this.radio) oLi.innerHTML = `<img height='${window.innerHeight}' src='${item["img"]}'>`
				else oLi.innerHTML = `<img width='${window.innerWidth}' src='${item["img"]}'>`
			}
			this.outer.appendChild(oLi)
		}
		this.outer.style.cssText = `width: ${this.pageWidth}px`
		wrap.style.height = `${window.innerHeight}px`
		wrap.appendChild(this.outer)
	}

	goIndex(n) {
		let index = this.index
		let oLis = this.outer.getElementsByTagName('li')
		let len = oLis.length
		let cIndex

		if(typeof n == 'number') cIndex = index 
		else cIndex = index + n*1

		if(cIndex > len-1) cIndex = len - 1
		if(cIndex < 0) cIndex = 0

		this.index = cIndex

		oLis[cIndex].style.webkitTransition ='-webkit-transform 0.2s ease-out'
		oLis[cIndex-1] && (oLis[cIndex-1].style.webkitTransition = '-webkit-transform 0.2s ease-out')
		oLis[cIndex+1] && (oLis[cIndex+1].style.webkitTransition = '-webkit-transform 0.2s ease-out')
		oLis[cIndex].style.webkitTransform = 'translate3d(0, 0, 0)'
		oLis[cIndex-1] && (oLis[cIndex-1].style.webkitTransform = `translate3d(${-this.pageWidth}px, 0, 0)`)
		oLis[cIndex+1] && (oLis[cIndex+1].style.webkitTransform = `translate3d(${this.pageWidth}px, 0, 0)`)
	}

	bindDOM() {
		let self = this
		let pageWidth = self.pageWidth
		let outer = self.outer
		let len = self.dataList.length

		let handlerStart = (evt) => {
			self.starTime = new Date() * 1
			self.startX = evt.touches[0].pageX
			self.offsetX = 0
		}

		let handlerMove = (evt) => {
			evt.preventDefault()

			self.offsetX = evt.targetTouches[0].pageX - self.startX
			let oLis = outer.getElementsByTagName('li')
			/**
			 * 滑动的时候一共可以看到三张图片
			 * 分别给这三张图片赋值
			 */
			let old = self.index -1
			let next = old + 3
			for(old; old<next; old++) {
				let newPos = (old -self.index)*(self.pageWidth) + self.offsetX
				oLis[old] && (oLis[old].style.webkitTransition = '-webkit-transform 0.2s ease-out')
				oLis[old] && (oLis[old].style.webkitTransform = `translate3d(${newPos}px, 0, 0)`)
			}
		}

		let handlerEnd = (evt) => {
			evt.preventDefault()

			let boundary = pageWidth/5
			let endTime = new Date() * 1
			let oLis = outer.getElementsByTagName('li')

			if(endTime - self.starTime > 200) {
				if(self.offsetX >= boundary){
					self.goIndex('-1')
				}else if(self.offsetX < 0 && self.offsetX < -boundary){
					self.goIndex('1')
				}else{
					self.goIndex('0')
				}
			} else {
				if(self.offsetX > 60){
					self.goIndex('-1')
				}else if(self.offsetX < -60){
					self.goIndex('+1')
				}else{
					self.goIndex('0')
				}
			}
		}

		outer.addEventListener('touchstart', handlerStart)
		outer.addEventListener('touchmove', handlerMove)
		outer.addEventListener('touchend', handlerEnd)
	}
}

window.Slider = Slider
