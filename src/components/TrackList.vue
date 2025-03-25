<template>
  <div class="page">
    <h1>Tracklist</h1>
    <table>
      <tbody>
        <tr>
          <td>1</td>
          <td>Track1</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Track2</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Track3</td>
        </tr>
        <tr>
          <td>4</td>
          <td>Track4</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* default style (mobile) */

/* 2column style (PC) */
@media (min-aspect-ratio: 1/1) {
  .fstracklist-container .page {
  position: block;
  top: 0;
  padding: 30px;
  z-index: 30;
  width: calc(50vw - 60px);
  height: calc(100% - 60px);
  background: #000000;
}
}
</style>