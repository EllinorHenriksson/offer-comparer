import Papa from "papaparse";
import { OfferProps } from "../types";

const Upload = ({ offers, setOffers }: OfferProps) => {    
	function parseFiles (files: File[]) {
		files.forEach(file => {
			Papa.parse(file, {
				complete: (results) => {				
					const offer = {
						fileName: file.name,
						fileData: results.data
					}
					setOffers([...offers, offer])
				}
			})		
		})
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			parseFiles(Array.from(e.target.files))
			e.target.value = ""
		}
	}

	const handleDrop = (e: React.DragEvent) => {
		// TODO:
		if (e.dataTransfer.files) {
			parseFiles(Array.from(e.dataTransfer.files))
		}
	}

	const handleRemove = (position: number) => {
		const currentOffers = Array.from(offers)
		currentOffers.splice(position, 1)
		setOffers(currentOffers)
	}

	return (
		<div className="upload">
			<div className="dropbox" onDrop={e => handleDrop(e)}>
				<label className="large-button" htmlFor="file-input">Select Files</label>
				<input id="file-input" type="file" accept=".csv" multiple onChange={e => handleFileChange(e)} />
				<p>Or drop files here</p>
				<p className="file-formats">Supported file formats: .csv</p>
			</div>
      <ul className="parsed-files">
        {
          offers.map(offer => (
            <li key={offers.indexOf(offer)}>
              <p>{offer.fileName}</p>
              <button className="small-button" onClick={() => handleRemove(offers.indexOf(offer))}>Remove</button>
            </li>
          ))
        }
      </ul>
		</div>
	);
}
 
export default Upload;