// @ts-nocheck
function extractSVG(root: any, options: any) {
  const styles: any = {
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

  options.legend.forEach((l: any, index: number) => {
    styles[`.q${index + 1}`] = {};
  });

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

  const filterStyles = (attribute: any, property: any, value: any) => {
    if (whitelistStyles.indexOf(property) !== -1) {
      styles[attribute][property] = value;
    }
  };

  const getElement = (e) => root.select(e).node();

  Object.keys(styles).forEach((element) => {
    const dom = getElement(element);

    if (dom === null) {
      return;
    }

    // The DOM Level 2 CSS way
    if ('getComputedStyle' in window) {
      const cs = getComputedStyle(dom, null);
      if (cs.length !== 0) {
        cs.item.forEach((item: any) => {
          filterStyles(element, item, cs.getPropertyValue(item));
        });

        // Opera workaround. Opera doesn"t support `item`/`length`
        // on CSSStyleDeclaration.
      } else {
        Object.entries(cs).forEach(([key, value]) => {
          filterStyles(element, key, value);
        });
      }

      // The IE way
    } else if ('currentStyle' in dom) {
      const css = dom.currentStyle;

      Object.entries(css).forEach(([key, value]) => {
        filterStyles(element, key, value);
      });
    }
  });

  let string =
    '<svg xmlns="http://www.w3.org/2000/svg" ' +
    'xmlns:xlink="http://www.w3.org/1999/xlink">' +
    '<style type="text/css"><![CDATA[ ';

  Object.entries(styles).forEach(([classname, values]) => {
    string += `${classname} {\n`;
    Object.entries(values).forEach((property, value) => {
      string += `\t${property}:${value};\n`;
    });
    string += '}\n';
  });

  string += ']]></style>';
  string += new XMLSerializer().serializeToString(root.node());
  string += '</svg>';

  return string;
}

export default extractSVG;
