<script
src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script>
document
.getElementById("downloadScheduleBtn")
.addEventListener("click",()=>{
  const original =
    document.getElementById("schedule-content");
  const copy =
    document.getElementById("download-content");
  copy.innerHTML = original.innerHTML;
  const target =
    document.getElementById("download-schedule");
  html2canvas(target,{
  scale:2,
  backgroundColor:"#101616",
  useCORS:true
})
  .then(canvas=>{
    const link =
      document.createElement("a");
    link.download =
      "FLARE-U-Schedule.png";
    link.href =
      canvas.toDataURL("image/png");
    link.click();
  });
});
</script>