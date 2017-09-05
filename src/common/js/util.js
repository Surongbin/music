//取到min 和max之间的随机数，包括min和max
function getRandomInt(min,max){
	return Math.floor(Math.random() * (max-min +1)+min)
}
//洗牌函数
export function shuffle(array){
	let arr = array.slice()//副本，否则会修改原数组
	for(let i = 0;i<arr.length;i++){
		let j = getRandomInt(0,i)
		let t = arr[i]
		arr[i] = arr[j]
		arr[j] = t
	}
	return arr
}
//截流函数,延迟执行函数,
export function debounce(func,delay){
	let timer

	return function(...args){
		if(timer){
			clearTimeout(timer)
		}
		timer = setTimeout(()=>{
			func.apply(this,args)
		},delay)
	}
}