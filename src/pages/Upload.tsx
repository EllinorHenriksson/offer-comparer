import Papa from "papaparse";
import { Offer, OfferProps } from "../types";
import { useState } from "react";

const Upload = ({ offers, setOffers }: OfferProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [flash, setFlash] = useState<string | null>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlash('')
    if (e.target.files) {
      const uniqueFiles = getUniqueFiles(Array.from(e.target.files))
      parseFiles(uniqueFiles)
      e.target.value = ""
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setFlash('')
    if (e.dataTransfer.files) {
      const uniqueFiles = getUniqueFiles(Array.from(e.dataTransfer.files))
      const correctFiles = getCorrectFiles(uniqueFiles)
      parseFiles(correctFiles)
    }
    setDragActive(false)
  }

  const handleRemove = (position: number) => {
    const currentOffers = Array.from(offers)
    currentOffers.splice(position, 1)
    setOffers(currentOffers)
  }

  function getUniqueFiles(files: File[]) {
    const uniqueFiles: File[] = []
    let duplicateFiles: string = ''
    files.forEach(file => {     
      if (isUnique(file.name)) {      
        uniqueFiles.push(file)
      } else {
        duplicateFiles += `\n${file.name} was already added`       
      }
    })
    if (duplicateFiles.length > 0) {
      setFlash(duplicateFiles)
    }
    return uniqueFiles
  }

  function isUnique(fileName: string) {
    let isUnique = true
    offers.forEach(offer => {
      if (offer.fileName === fileName) {
        isUnique = false
      }
    })
    return isUnique
  }

  function getCorrectFiles(files: File[]) {
    const correctFiles: File[] = []
    let incorrectFiles: string = ''
    const regex = /.csv$/
    files.forEach(file => {
      if (regex.test(file.name)) {
        correctFiles.push(file)
      } else {
        incorrectFiles += `\n${file.name} does not have the correct file format`
      }
    })
    if (incorrectFiles.length > 0) {
      setFlash(incorrectFiles)
    }
    return correctFiles
  }

  async function parseFiles(files: File[]) {
    try {
      const newOffers = await Promise.all(files.map(file =>
        new Promise<Offer>((resolve, reject) =>
          Papa.parse(file, {
            header: true,
            complete: (results) => {
              resolve({
                fileName: file.name,
                fileData: results.data
              })
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
      {flash && <p>{flash}</p>}
    </div>
  );
}

export default Upload;