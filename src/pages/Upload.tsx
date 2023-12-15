import Papa from "papaparse";
import { OfferType, OfferProps, ProductPart, ProductPartWithChildren } from "../types";
import { useState } from "react";

const Upload = ({ offers, setOffers }: OfferProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [flashMessages, setFlashMessages] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const { uniqueFiles, duplicateFiles } = groupOnUniqueness(Array.from(e.target.files))
      if (duplicateFiles.length) {
        setFlashMessages(generateMessagesDuplicate(duplicateFiles))
        setTimeout(() => {
          setFlashMessages([])
        }, 5000);
      }
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
    if (e.dataTransfer.files) {
      const { uniqueFiles, duplicateFiles } = groupOnUniqueness(Array.from(e.dataTransfer.files))
      const { correctFiles, incorrectFiles } = groupOnCorrectness(uniqueFiles)
      if (duplicateFiles.length || incorrectFiles.length) {
        setFlashMessages([...generateMessagesDuplicate(duplicateFiles), ...generateMessagesIncorrect(incorrectFiles)])
        setTimeout(() => {
          setFlashMessages([])
        }, 5000);
      }
      parseFiles(correctFiles)
    }
    setDragActive(false)
  }

  const handleRemove = (position: number) => {
    const currentOffers = Array.from(offers)
    currentOffers.splice(position, 1)
    setOffers(currentOffers)
  }

  function groupOnUniqueness(files: File[]) {
    const uniqueFiles: File[] = []
    const duplicateFiles: File[] = []
    files.forEach(file => {
      if (isUnique(file.name)) {
        uniqueFiles.push(file)
      } else {
        duplicateFiles.push(file)
      }
    })

    return { uniqueFiles, duplicateFiles }
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

  function generateMessagesDuplicate(files: File[]) {
    return files.map(file => `${file.name} has already been added`)
  }

  function generateMessagesIncorrect(files: File[]) {
    return files.map(file => `${file.name} does not have the correct format`)
  }

  function groupOnCorrectness(files: File[]) {
    const correctFiles: File[] = []
    const incorrectFiles: File[] = []
    const regex = /.csv$/
    files.forEach(file => {
      if (regex.test(file.name)) {
        correctFiles.push(file)
      } else {
        incorrectFiles.push(file)
      }
    })
    return { correctFiles, incorrectFiles }
  }

  async function parseFiles(files: File[]) {
    try {
      const newOffers = await Promise.all(files.map(file =>
        new Promise<OfferType>((resolve, reject) =>
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (results) => {
              const productParts = transformData(results.data)
              const nestedProductParts = nestProductParts(productParts)
              resolve({
                fileName: file.name,
                products: nestedProductParts,
                cost: calcCost(productParts)
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

  const transformData = (data: any[]): ProductPartWithChildren[] => {
    const parts = data.map((item: any) => {
      let price = null
      if (item['Price ($)']) {
        price = parseInt(item['Price ($)'].replaceAll(/\$|,/g, ''))
      }

      return {
        productPart: {
        name: item['Name'],
        type: item['Type'],
        quantity: item['Quantity'],
        price: price,
        failureRate: item['Failure rate (1/year)'],
        description: item['Description'],
        parent: item['Parent']
      },
      children: []
    }
    })

    return parts
  }

  function nestProductParts (parts: ProductPartWithChildren[]): ProductPartWithChildren[] {
    const products = parts.filter(part => part.productPart.type === 'Product')
    products.forEach(product => {
      nestRecursively(product, parts)
    })

    return products
  }

  function nestRecursively (parent: ProductPartWithChildren, parts: ProductPartWithChildren[]) {
    const children = parts.filter(part => part.productPart.parent === parent.productPart.name)
    parent.children = children
    children.forEach(child => {
      nestRecursively(child, parts)
    })
  }

  const calcCost = (data: ProductPartWithChildren[]) => {
    let sum = 0
    data.forEach(item => {            
      if (item.productPart.price) {
        sum += item.productPart.price
      }
    })
    return sum
  }

  return (
    <div className="upload">
      <h2>Upload</h2>
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
      {flashMessages.length > 0 && <div className="flash">{flashMessages.map(message => (
        <p key={message}>{message}</p>
      ))}</div>}
    </div>
  );
}

export default Upload;