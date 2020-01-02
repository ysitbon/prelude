require('@babel/register')({
  rootMode: "upward",
  ignore: [
    /node_modules\/(?:\@prelude)/
  ]
});
