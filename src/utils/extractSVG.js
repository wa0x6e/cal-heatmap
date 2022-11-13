function extractSVG(root, options) {
  const styles = {
    '.cal-heatmap-container': {},
    '.graph': {},
    '.graph-rect': {},
    'rect.highlight': {},
    'rect.now': {},
    'rect.highlight-now': {},
    'text.highlight': {},
    'text.now': {},
    'text.highlight-now': {},
    '.domain-background': {},
    '.graph-label': {},
    '.subdomain-text': {},
    '.q0': {},
    '.qi': {},
  };

  for (let j = 1, total = options.legend.length + 1; j <= total; j++) {
    styles[`.q${j}`] = {};
  }

  const whitelistStyles = [
    // SVG specific properties
    'stroke',
    'stroke-width',
    'stroke-opacity',
    'stroke-dasharray',
    'stroke-dashoffset',
    'stroke-linecap',
    'stroke-miterlimit',
    'fill',
    'fill-opacity',
    'fill-rule',
    'marker',
    'marker-start',
    'marker-mid',
    'marker-end',
    'alignement-baseline',
    'baseline-shift',
    'dominant-baseline',
    'glyph-orientation-horizontal',
    'glyph-orientation-vertical',
    'kerning',
    'text-anchor',
    'shape-rendering',

    // Text Specific properties
    'text-transform',
    'font-family',
    'font',
    'font-size',
    'font-weight',
  ];

  const filterStyles = (attribute, property, value) => {
    if (whitelistStyles.indexOf(property) !== -1) {
      styles[attribute][property] = value;
    }
  };

  const getElement = e => root.select(e).node();

  for (const element in styles) {
    if (!styles.hasOwnProperty(element)) {
      continue;
    }

    const dom = getElement(element);

    if (dom === null) {
      continue;
    }

    // The DOM Level 2 CSS way
    if ('getComputedStyle' in window) {
      const cs = getComputedStyle(dom, null);
      if (cs.length !== 0) {
        for (let i = 0; i < cs.length; i++) {
          filterStyles(element, cs.item(i), cs.getPropertyValue(cs.item(i)));
        }

        // Opera workaround. Opera doesn"t support `item`/`length`
        // on CSSStyleDeclaration.
      } else {
        for (const k in cs) {
          if (cs.hasOwnProperty(k)) {
            filterStyles(element, k, cs[k]);
          }
        }
      }

      // The IE way
    } else if ('currentStyle' in dom) {
      const css = dom.currentStyle;
      for (const p in css) {
        filterStyles(element, p, css[p]);
      }
    }
  }

  let string =
    '<svg xmlns="http://www.w3.org/2000/svg" ' +
    'xmlns:xlink="http://www.w3.org/1999/xlink"><style type="text/css"><![CDATA[ ';

  for (const style in styles) {
    string += `${style} {\n`;
    for (const l in styles[style]) {
      string += `\t${l}:${styles[style][l]};\n`;
    }
    string += '}\n';
  }

  string += ']]></style>';
  string += new XMLSerializer().serializeToString(root.node());
  string += '</svg>';

  return string;
}

export default extractSVG;
