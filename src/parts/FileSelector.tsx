import { FileProps } from "../types"

const FileSelector = ({ files, setFiles }: FileProps) => {
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newFiles = Array.from(e.target.files)
			setFiles([...files, ...newFiles])	
		}
	}

	const handleDrop = (e: React.DragEvent) => {
		// TODO: (Även styling av filerna)
		if (e.dataTransfer.files) {
			const newFiles = Array.from(e.dataTransfer.files)
			setFiles([...files, ...newFiles])
		}
	}

	const handleRemove = (position: number) => {
		const currentFiles = Array.from(files)
		currentFiles.splice(position, 1)
		setFiles(currentFiles)
	}

	return (
		<div className="file-selector">
			<div className="dropbox" onDrop={e => handleDrop(e)}>
				<label htmlFor="file-input">Select Files</label>
				<input id="file-input" type="file" accept=".csv" multiple onChange={e => handleFileChange(e)} />
				<p>Or drop files here</p>
				<p className="file-formats">Supported file formats: .csv</p>
			</div>
			<div className="selectedFiles">
				{
					files.map(file => (
						<div key={files.indexOf(file)}>
							{ file.name }
							<button onClick={() => handleRemove(files.indexOf(file)) }>Remove</button>
						</div>
					))
				}
			</div>
		</div>
	);
}

export default FileSelector;