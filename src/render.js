const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false
ctx.mozImageSmoothingEnabled = false
ctx.webkitImageSmoothingEnabled = false

let fileName = 'test.js'
let colors = {
	foreground: 'white',
	background: 'black'
}

let output = ''

function setupCanvas() {
	canvas.width = 1
	canvas.height = 1
}

function clearCanvas() {
	ctx.fillStyle = colors.background
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

function prepareFont(font, size, bold) {
	ctx.font = bold ? `bold ${size}px "${font}"` : `${size}px "${font}"`
	ctx.fillStyle = colors.foreground
}

function prepareCanvas(width, height) {
	canvas.width = width
	canvas.height = height
	clearCanvas()
}

function getSumOfColumns(r, col, row) {
	let bits = []
	for (let i = 0; i < col; i++) {
		let bit = 0
		for (let j = 0; j < row; j++) bit += r[j * col + i] ? Math.pow(2, j) : 0
		bits.push(bit)
	}
	return bits
}

function render() {
	const boldFonts = document.getElementById('rA').checked
	const boundingBoxes = document.getElementById('rB').checked
	document.getElementById('previewElm').setAttribute('data-boxes', boundingBoxes ? true : false)

	setupCanvas()
	clearCanvas()

	const font = document.querySelector('#fontFamily').value || 'Consolas'
	const size = document.querySelector('#size').value
	const crop = Number(document.querySelector('#crop').value)
	const y = Number(document.querySelector('#offset').value)
	const glyphs = document.querySelector('#glyphs').value
	const threshold = Number(document.querySelector('#threshold').value)
	prepareFont(font, size, boldFonts)

	const width = Math.floor(ctx.measureText('A').width) + crop
	const { actualBoundingBoxAscent, actualBoundingBoxDescent } = ctx.measureText(glyphs)
	const height = Math.round(actualBoundingBoxAscent + actualBoundingBoxDescent)
	let lookup = []
	let fontData = []

	if (width < 0 || height < 0) return false

	prepareCanvas(width, height)
	ctx.translate(0, 0)

	for (let i = 0, n = glyphs.length; i < n; i++) {
		const glyph = glyphs[i]
		clearCanvas()
		prepareFont(font, size, boldFonts)
		ctx.fillText(glyph, crop * 0.5, height + y)
		try {
			const red = []
			const full = ctx.getImageData(0, 0, width, height)
			for (let x = 0, n = full.data.length; x < n; x += 4) {
				const bit = full.data[x] >= threshold ? 255 : 0
				full.data[x] = bit
				full.data[x + 1] = bit
				full.data[x + 2] = bit
				red.push(bit)
			}
			ctx.putImageData(full, 0, 0)
			document.getElementById('__g' + i).src = ctx.canvas.toDataURL()

			fontData.push.apply(fontData, getSumOfColumns(red, width, height))
			lookup.push(glyph)
		} catch (error) {
			console.error(error)
			return false
		}
	}

	const fontObj = {
		name: font.toLowerCase().replace(/\s/g, '_') + '_' + size,
		monospace: true,
		width,
		height,
		threshold,
		crop,
		y,
		fontData,
		lookup
	}

	const dataCode = JSON.stringify(fontObj)
	output = '// prettier-ignore\nexport default ' + dataCode
	fileName = `font.${fontObj.name}.js`
	document.getElementById('code').value = `// ${fileName}\nexport default ${dataCode}`
}
