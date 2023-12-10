import Papa from "papaparse";
import { Offer, OfferProps } from "../types";
import { useState } from "react";

const Upload = ({ offers, setOffers }: OfferProps) => { 
  const [dragActive, setDragActive] = useState(false);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			parseFiles(Array.from(e.target.files))      
			e.target.value = ""
		}
	}

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {     
      parseFiles(Array.from(e.dataTransfer.files))
    }
    setDragActive(false)
  }

  const handleRemove = (position: number) => {
    const currentOffers = Array.from(offers)
    currentOffers.splice(position, 1)
    setOffers(currentOffers)
  }

  async function parseFiles(files: File[]) {
    try {
      const newOffers = await Promise.all(files.map(file =>
        new Promise<Offer>((resolve, reject) =>
          Papa.parse(file, {
            header: true,
            complete: (results) => {
              resolve({fileName: file.name, fileData: results.data})
            },
            error: (error, file) => {
              reject(error)
            },
          }),
        )
      ),
      )

      setOffers([...offers, ...newOffers])      
    } catch (error) {
      console.log(error);
    }
  }

	return (
		<div className="upload">
			<div className={`dropbox ${dragActive ? 'drag-active' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
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