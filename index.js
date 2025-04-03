const defaultFont = 'Consolas'
const defaultGlyphs =
	' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'

const updateOutput = elm => {
	const output = elm.previousElementSibling.querySelector('code')
	output.innerText = `${elm.value}${output.getAttribute('data-unit')}`
}

const updateFontFamily = elm => {
	document.getElementById('preview').style.fontFamily = `"${elm}", ${defaultFont}, monospace`
	document.getElementById('glyphs').style.fontFamily = `"${elm}", ${defaultFont}, monospace`
}

const updateGlyphs = elm => {
	elm.value = Array.from(new Set(elm.value.split(''))).join('')

	const preview = document.querySelector('#preview')
	preview.innerHTML = ''

	for (let i = 0, n = elm.value.length; i < n; i++) {
		const img = document.createElement('img')
		img.setAttribute('id', '__g' + i)
		preview.appendChild(img)
	}
}

const fontFamily = document.querySelector('#fontFamily')
fontFamily.addEventListener('input', elm => {
	updateFontFamily(elm.target.value)
	render()
})
fontFamily.addEventListener('change', elm => {
	elm.target.value = elm.target.value.trim()
	updateFontFamily(elm.target.value)
	render()
})
updateFontFamily(fontFamily.value)

document.querySelectorAll('input[type="range"]').forEach(elm => {
	elm.addEventListener('input', _ => {
		updateOutput(elm)
		render()
	})
	updateOutput(elm)
})

const glyphs = document.querySelector('#glyphs')
glyphs.value = defaultGlyphs
glyphs.addEventListener('input', elm => {
	updateGlyphs(elm.target)
	render()
})
updateGlyphs(glyphs)

let timeOut1 = setTimeout(_ => {}, 10)
let timeOut2 = setTimeout(_ => {}, 10)
const btnCopy = document.querySelector('#copy')
const btnDownload = document.querySelector('#download')

const copyCode = async () => {
	if (timeOut1) clearTimeout(timeOut1)
	btnCopy.setAttribute('data-done', 'true')
	timeOut1 = setTimeout(_ => btnCopy.setAttribute('data-done', 'false'), 2000)
	try {
		await navigator.clipboard.writeText(output)
		console.log('Content copied to clipboard')
	} catch (err) {
		console.error('Failed to copy: ', err)
	}
}

const download = async () => {
	if (timeOut2) clearTimeout(timeOut2)
	btnDownload.setAttribute('data-done', 'true')
	timeOut2 = setTimeout(_ => btnDownload.setAttribute('data-done', 'false'), 2000)
}

btnCopy.addEventListener('click', copyCode)
btnDownload.addEventListener('click', download)

render()
