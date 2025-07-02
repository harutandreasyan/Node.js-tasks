const { DirectoryInfo } = require('./DirectoryInfo')

async function main() {
	const dir = new DirectoryInfo('./test')

	console.log('Files:', await dir.getFiles())
	console.log('Folders:', await dir.getDirectories())

	console.log('\nDirectory structure:')
	await dir.printTree()

	console.log('\nAfter organizing:')
	await dir.organize()
	await dir.printTree()
}

main()
