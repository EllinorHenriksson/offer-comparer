import FileSelector from "../parts/FileSelector";
import { FileProps } from "../types";

const Upload = ({ files, setFiles }: FileProps) => {    
    return (
        <div className="upload">
            <FileSelector files={files} setFiles={setFiles} />
        </div>
    );
}
 
export default Upload;