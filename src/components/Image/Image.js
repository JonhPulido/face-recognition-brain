import React from "react";

class Image extends React.Component {
  render() {
    const {imageObj} = this.props;
    return (
        <div className='fl w-50-l w-100-m'>
          <h1>Photo name here</h1>
          {<img className='grow' alt='' src={imageObj.image_url}/> }
          <p>{imageObj.uploaded}</p>
        </div>
      );
  }
}
export default Image;
