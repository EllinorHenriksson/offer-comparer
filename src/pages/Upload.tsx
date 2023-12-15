import Papa from "papaparse";
import { OfferType, OfferProps, ProductPartWithChildren } from "../types";
import { useState } from "react";

/**
 * Represents the Upload page.
 * 
 * @param offers The offers that are currently uploaded to the application
 * @param setOffers The setState function for the offers prop 
 */
const Upload = ({ offers, setOffers }: OfferProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [flashMessages, setFlashMessages] = useState<string[]>([])

  /**
   * Controls file input and parses the files, which are then added to the offers prop.
   * 
   * @param e The event object
   */
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

  /**
   * Handles drag events by changing dragActive state accordingly.
   * 
   * @param e The event object
   */
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  /**
   * Handles drop events by checking the file input and parsing the files, which are added to the offers prop.
   * 
   * @param e The event object
   */
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

  /**
   * Removes an offer from the offers prop.
   *
   * @param fileName The file name of the offer to remove
   */
  const handleRemove = (fileName: string) => {
    const currentOffers = Array.from(offers)
    const index = currentOffers.findIndex(offer => offer.fileName === fileName)
    currentOffers.splice(index, 1)
    setOffers(currentOffers)
  }

  /**
   * Groups the files in two groups; one for unique files and one for duplicate files.
   *
   * @param files The files to group
   * @returns The grouped files
   */
  function groupOnUniqueness(files: File[]): {uniqueFiles: File[], duplicateFiles: File[]} {
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

  /**
   * Checks if the file is unique or already has been uploaded and added to the offers prop.
   *
   * @param fileName The file name of the file to check
   * @returns True if the file is unique, otherwise false
   */
  function isUnique(fileName: string): boolean {
    let isUnique = true
    offers.forEach(offer => {
      if (offer.fileName === fileName) {
        isUnique = false
      }
    })
    return isUnique
  }

   /**
   * Groups the files in two groups; one for files with correct file format and one for incorrect files.
   *
   * @param files The files to group
   * @returns The grouped files
   */
   function groupOnCorrectness(files: File[]): {correctFiles: File[], incorrectFiles: File[]} {
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

  /**
   * Generates flash messages for each duplicate file.
   * 
   * @param files The duplicate files
   * @returns The flash messages
   */
  function generateMessagesDuplicate(files: File[]): string[] {
    return files.map(file => `${file.name} has already been added`)
  }

  /**
   * Generates flash messages for each incorrect file.
   *
   * @param files  The incorrect files
   * @returns The flash messages
   */
  function generateMessagesIncorrect(files: File[]): string[] {
    return files.map(file => `${file.name} does not have the correct format`)
  }

  /**
   * Parses the files, transformes the data into offers and adds them to the offers prop.
   *
   * @param files The files to parse
   */
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

  /**
   * Transforms file data into an representative object, and nests them accordingly.
   *
   * @param data The parsed file data (an array of objects)
   * @returns The transformed and nested files
   */
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

  /**
   * Nests the product parts in the offer accordingly to their parent property.
   * 
   * @param parts The product parts to nest
   * @returns The nested product parts
   */
  function nestProductParts (parts: ProductPartWithChildren[]): ProductPartWithChildren[] {
    const products = parts.filter(part => part.productPart.type === 'Product')
    products.forEach(product => {
      nestRecursively(product, parts)
    })

    return products
  }

  /**
   * Recursively nests the product parts of the offer.
   * 
   * @param parent The parent product part to add children product parts to
   * @param parts All product parts
   */
  function nestRecursively (parent: ProductPartWithChildren, parts: ProductPartWithChildren[]) {
    const children = parts.filter(part => part.productPart.parent === parent.productPart.name)
    parent.children = children
    children.forEach(child => {
      nestRecursively(child, parts)
    })
  }

  /**
   * Calculates the total cost of an offer.
   * 
   * @param data The product part data of the offer
   * @returns The total cost
   */
  const calcCost = (data: ProductPartWithChildren[]): number => {
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
            <li key={offer.fileName}>
              <p>{offer.fileName}</p>
              <button className="small-button" onClick={() => handleRemove(offer.fileName)}>Remove</button>
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