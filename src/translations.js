const en = {
  loading: "Loading model…",
  failed: "Cannot display this model. Check the file and preview it again.",
  instructions:
    "Drag to rotate. Scroll or pinch to zoom. Arrow keys pan; Shift + arrows rotate. + and - zoom. Home fits the model.",
  viewport: "Interactive 3D model",
  dimensions: "X {{x}} × Y {{y}} × Z {{z}} {{unit}}",
  spacing: "Grid spacing: {{value}} {{unit}}",
  fit: "Fit",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  model: "model units",
};
export const translations = {
  en,
  "pt-pt": {
    loading: "A carregar o modelo…",
    failed:
      "Não é possível apresentar este modelo. Verifique o ficheiro e tente novamente.",
    instructions:
      "Arraste para rodar. Use a roda ou dois dedos para ampliar. As setas deslocam; Shift + setas rodam. + e - ampliam. Home ajusta o modelo.",
    viewport: "Modelo 3D interativo",
    dimensions: "X {{x}} × Y {{y}} × Z {{z}} {{unit}}",
    spacing: "Espaçamento da grelha: {{value}} {{unit}}",
    fit: "Ajustar",
    zoomIn: "Ampliar",
    zoomOut: "Reduzir",
    model: "unidades do modelo",
  },
  "zh-cn": {
    loading: "正在加载模型…",
    failed: "无法显示此模型。请检查文件后重新预览。",
    instructions:
      "拖动以旋转。滚动或双指缩放。方向键平移，Shift + 方向键旋转，+ 和 - 缩放，Home 适配模型。",
    viewport: "交互式 3D 模型",
    dimensions: "X {{x}} × Y {{y}} × Z {{z}} {{unit}}",
    spacing: "网格间距：{{value}} {{unit}}",
    fit: "适配",
    zoomIn: "放大",
    zoomOut: "缩小",
    model: "模型单位",
  },
  "zh-hk": {
    loading: "正在載入模型…",
    failed: "無法顯示此模型。請檢查檔案後重新預覽。",
    instructions:
      "拖曳以旋轉。捲動或雙指縮放。方向鍵平移，Shift + 方向鍵旋轉，+ 和 - 縮放，Home 配合模型。",
    viewport: "互動式 3D 模型",
    dimensions: "X {{x}} × Y {{y}} × Z {{z}} {{unit}}",
    spacing: "網格間距：{{value}} {{unit}}",
    fit: "配合",
    zoomIn: "放大",
    zoomOut: "縮小",
    model: "模型單位",
  },
  "zh-tw": {
    loading: "正在載入模型…",
    failed: "無法顯示此模型。請檢查檔案後重新預覽。",
    instructions:
      "拖曳以旋轉。捲動或雙指縮放。方向鍵平移，Shift + 方向鍵旋轉，+ 和 - 縮放，Home 配合模型。",
    viewport: "互動式 3D 模型",
    dimensions: "X {{x}} × Y {{y}} × Z {{z}} {{unit}}",
    spacing: "網格間距：{{value}} {{unit}}",
    fit: "配合",
    zoomIn: "放大",
    zoomOut: "縮小",
    model: "模型單位",
  },
  ja: {
    loading: "モデルを読み込み中…",
    failed:
      "モデルを表示できません。ファイルを確認して再度プレビューしてください。",
    instructions:
      "ドラッグで回転、スクロールまたはピンチで拡大縮小。矢印キーで移動、Shift + 矢印キーで回転、+ と - で拡大縮小、Home で全体表示。",
    viewport: "操作可能な 3D モデル",
    dimensions: "X {{x}} × Y {{y}} × Z {{z}} {{unit}}",
    spacing: "グリッド間隔：{{value}} {{unit}}",
    fit: "全体表示",
    zoomIn: "拡大",
    zoomOut: "縮小",
    model: "モデル単位",
  },
  ko: {
    loading: "모델 로딩 중…",
    failed: "모델을 표시할 수 없습니다. 파일을 확인하고 다시 미리 보세요.",
    instructions:
      "드래그하여 회전합니다. 스크롤하거나 두 손가락으로 확대합니다. 방향키로 이동, Shift + 방향키로 회전, + 및 -로 확대/축소, Home으로 전체 보기.",
    viewport: "대화형 3D 모델",
    dimensions: "X {{x}} × Y {{y}} × Z {{z}} {{unit}}",
    spacing: "격자 간격: {{value}} {{unit}}",
    fit: "전체 보기",
    zoomIn: "확대",
    zoomOut: "축소",
    model: "모델 단위",
  },
};

const errors = {
  en: {
    invalid: "This file is not a valid, finite STL model.",
    limit:
      "This model exceeds the preview limits: 64 MiB, 1,000,000 triangles, or 256 MiB of accounted allocations.",
    timeout: "Parsing exceeded ten seconds. Try a smaller model.",
    gpu: "3D graphics are unavailable or the graphics context was lost. Close this preview and try again.",
  },
  "pt-pt": {
    invalid:
      "Este ficheiro não é um modelo STL válido com coordenadas finitas.",
    limit:
      "Este modelo excede os limites: 64 MiB, 1 000 000 de triângulos ou 256 MiB de memória contabilizada.",
    timeout: "A análise excedeu dez segundos. Tente um modelo mais pequeno.",
    gpu: "Os gráficos 3D não estão disponíveis ou o contexto gráfico foi perdido. Feche a pré-visualização e tente novamente.",
  },
  "zh-cn": {
    invalid: "此文件不是坐标有限的有效 STL 模型。",
    limit:
      "模型超出预览限制：64 MiB、1,000,000 个三角形或 256 MiB 的计入内存。",
    timeout: "解析超过十秒。请尝试较小的模型。",
    gpu: "3D 图形不可用或图形上下文已丢失。请关闭预览后重试。",
  },
  "zh-hk": {
    invalid: "此檔案不是座標有限的有效 STL 模型。",
    limit:
      "模型超出預覽限制：64 MiB、1,000,000 個三角形或 256 MiB 的計入記憶體。",
    timeout: "解析超過十秒。請嘗試較小的模型。",
    gpu: "3D 圖形不可用或圖形上下文已遺失。請關閉預覽後重試。",
  },
  "zh-tw": {
    invalid: "此檔案不是座標有限的有效 STL 模型。",
    limit:
      "模型超出預覽限制：64 MiB、1,000,000 個三角形或 256 MiB 的計入記憶體。",
    timeout: "解析超過十秒。請嘗試較小的模型。",
    gpu: "3D 圖形不可用或圖形上下文已遺失。請關閉預覽後重試。",
  },
  ja: {
    invalid: "有限座標の有効な STL モデルではありません。",
    limit:
      "プレビュー制限を超えています：64 MiB、100万三角形、または計算対象メモリ 256 MiB。",
    timeout: "解析に10秒以上かかりました。より小さいモデルを試してください。",
    gpu: "3D グラフィックスを使用できないか、コンテキストが失われました。プレビューを閉じて再試行してください。",
  },
  ko: {
    invalid: "유한 좌표를 가진 유효한 STL 모델이 아닙니다.",
    limit:
      "미리 보기 한도를 초과했습니다: 64 MiB, 삼각형 1,000,000개 또는 계산된 메모리 256 MiB.",
    timeout: "분석이 10초를 초과했습니다. 더 작은 모델을 사용하세요.",
    gpu: "3D 그래픽을 사용할 수 없거나 그래픽 컨텍스트가 손실되었습니다. 미리 보기를 닫고 다시 시도하세요.",
  },
};
for (const [locale, messages] of Object.entries(errors))
  Object.assign(translations[locale], messages);
