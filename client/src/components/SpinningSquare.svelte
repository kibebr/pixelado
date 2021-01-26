<style>
  div {
    background-color: rgba(0, 0, 0, 0.1);
    width:50px;
    height:50px;
    margin:20px auto;
    -webkit-animation:rescale 2s infinite;
    animation: rescale 2s infinite;
    box-shadow: 1px 1px 0px black,
    2px 2px 0px black,
    3px 3px 0px black,
    4px 4px 0px black,
    5px 5px 0px black,
    6px 6px 0px black;
  }

  @keyframes rescale {
    0% {transform:rotate(0deg);}
    10% {transform:rotate(36deg);}
    20% {transform:rotate(72deg);}
    30% {transform:rotate(108deg);}
    40% {transform:rotate(144deg);}
    50% {transform:rotate(180deg);}
    60% {transform:rotate(216deg);}
    70% {transform:rotate(252deg);}
    80% {transform:rotate(288deg);}
    90% {transform:rotate(334deg);}
    100% {transform:rotate(360deg);}
  }
</style>

<div>
</div>
