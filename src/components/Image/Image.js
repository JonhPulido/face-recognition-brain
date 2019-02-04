import React from "react";

class Image extends React.Component {
  render() {
    const { imageObj } = this.props;
    return (
        <div className='fl w-50-l w-100-m'>
          <h1>{imageObj.name}</h1>
          <img className='grow' src={imageObj.img} />
          <p>Photo Description here</p>
        </div>
      );
  }
}
export default Image;
