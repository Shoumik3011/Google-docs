//  import React from "react";
// //  import slate-react from "react";
// import  {Slate} from 'slate-react'
// import { Editor} from 'slate'
//  //import { Value } from 'slate-react'
// // import { createEditor, Editor as SlateEditor, Element as SlateElement, Transforms } from 'slate';
// // import { withHistory } from 'slate-history';
//  //import { Editable, Slate, useSlate, withReact ,Value} from 'slate-react';

// const initialValue = Slate.Value.fromJSON({
//   document: {
//     nodes: [
//       {
//         object: 'block',
//         type: 'paragraph',
//         nodes: [
//           {
//             object: 'text',
//             text: 'A line of text in a paragraph.',
//           },
//         ],
//       },
//     ],
//   },
// }as any)

// // Define our app...
// class App extends React.Component {
//   // Set the initial value when the app is first constructed.
//   state = {
//     value: initialValue,
//   }

//   // On change, update the app's React state with the new editor value.
//   onChange = ({ value }) => {
//     this.setState({ value })
//   }

//   // Render the editor.
//   render() {
//     return <Editor value={this.state.value} onChange={this.onChange} />
//   }
// }
// export default App;