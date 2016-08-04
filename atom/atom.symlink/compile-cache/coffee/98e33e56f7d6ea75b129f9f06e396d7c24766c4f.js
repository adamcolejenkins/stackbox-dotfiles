(function() {
  var cmykToRGB, hcgToRGB, hexARGBToRGB, hexRGBAToRGB, hexToRGB, hslToRGB, hsvToHWB, hsvToRGB, hwbToHSV, hwbToRGB, rgbToCMYK, rgbToHCG, rgbToHSL, rgbToHSV, rgbToHWB, rgbToHex, rgbToHexARGB, rgbToHexRGBA;

  rgbToHex = function(r, g, b) {
    var rnd, value;
    rnd = Math.round;
    value = ((rnd(r) << 16) + (rnd(g) << 8) + rnd(b)).toString(16);
    while (value.length < 6) {
      value = "0" + value;
    }
    return value;
  };

  hexToRGB = function(hex) {
    var b, color, g, r;
    color = parseInt(hex, 16);
    r = (color >> 16) & 0xff;
    g = (color >> 8) & 0xff;
    b = color & 0xff;
    return [r, g, b];
  };

  rgbToHexARGB = function(r, g, b, a) {
    var rnd, value;
    rnd = Math.round;
    value = ((rnd(a * 255) << 24) + (rnd(r) << 16) + (rnd(g) << 8) + rnd(b)).toString(16);
    while (value.length < 8) {
      value = "0" + value;
    }
    return value;
  };

  rgbToHexRGBA = function(r, g, b, a) {
    var rnd, value;
    rnd = Math.round;
    value = ((rnd(r) << 24) + (rnd(g) << 16) + (rnd(b) << 8) + rnd(a * 255)).toString(16);
    while (value.length < 8) {
      value = "0" + value;
    }
    return value;
  };

  hexARGBToRGB = function(hex) {
    var a, b, color, g, r;
    color = parseInt(hex, 16);
    a = ((color >> 24) & 0xff) / 255;
    r = (color >> 16) & 0xff;
    g = (color >> 8) & 0xff;
    b = color & 0xff;
    return [r, g, b, a];
  };

  hexRGBAToRGB = function(hex) {
    var a, b, color, g, r;
    color = parseInt(hex, 16);
    r = (color >> 24) & 0xff;
    g = (color >> 16) & 0xff;
    b = (color >> 8) & 0xff;
    a = (color & 0xff) / 255;
    return [r, g, b, a];
  };

  rgbToHSV = function(r, g, b) {
    var delta, deltaB, deltaG, deltaR, h, maxVal, minVal, rnd, s, v;
    r = r / 255;
    g = g / 255;
    b = b / 255;
    rnd = Math.round;
    minVal = Math.min(r, g, b);
    maxVal = Math.max(r, g, b);
    delta = maxVal - minVal;
    v = maxVal;
    if (delta === 0) {
      h = 0;
      s = 0;
    } else {
      s = delta / v;
      deltaR = (((v - r) / 6) + (delta / 2)) / delta;
      deltaG = (((v - g) / 6) + (delta / 2)) / delta;
      deltaB = (((v - b) / 6) + (delta / 2)) / delta;
      if (r === v) {
        h = deltaB - deltaG;
      } else if (g === v) {
        h = (1 / 3) + deltaR - deltaB;
      } else if (b === v) {
        h = (2 / 3) + deltaG - deltaR;
      }
      if (h < 0) {
        h += 1;
      }
      if (h > 1) {
        h -= 1;
      }
    }
    return [h * 360, s * 100, v * 100];
  };

  hsvToRGB = function(h, s, v) {
    var b, comp1, comp2, comp3, dominant, g, r, rnd, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
    h = h / 60;
    s = s / 100;
    v = v / 100;
    rnd = Math.round;
    if (s === 0) {
      return [rnd(v * 255), rnd(v * 255), rnd(v * 255)];
    } else {
      dominant = Math.floor(h);
      comp1 = v * (1 - s);
      comp2 = v * (1 - s * (h - dominant));
      comp3 = v * (1 - s * (1 - (h - dominant)));
      switch (dominant) {
        case 0:
          _ref = [v, comp3, comp1], r = _ref[0], g = _ref[1], b = _ref[2];
          break;
        case 1:
          _ref1 = [comp2, v, comp1], r = _ref1[0], g = _ref1[1], b = _ref1[2];
          break;
        case 2:
          _ref2 = [comp1, v, comp3], r = _ref2[0], g = _ref2[1], b = _ref2[2];
          break;
        case 3:
          _ref3 = [comp1, comp2, v], r = _ref3[0], g = _ref3[1], b = _ref3[2];
          break;
        case 4:
          _ref4 = [comp3, comp1, v], r = _ref4[0], g = _ref4[1], b = _ref4[2];
          break;
        default:
          _ref5 = [v, comp1, comp2], r = _ref5[0], g = _ref5[1], b = _ref5[2];
      }
      return [r * 255, g * 255, b * 255];
    }
  };

  rgbToHSL = function(r, g, b) {
    var d, h, l, max, min, s, _ref;
    _ref = [r / 255, g / 255, b / 255], r = _ref[0], g = _ref[1], b = _ref[2];
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    h = void 0;
    s = void 0;
    l = (max + min) / 2;
    d = max - min;
    if (max === min) {
      h = s = 0;
    } else {
      s = (l > 0.5 ? d / (2 - max - min) : d / (max + min));
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
      }
      h /= 6;
    }
    return [h * 360, s * 100, l * 100];
  };

  hslToRGB = function(h, s, l) {
    var clamp, hue, m1, m2;
    clamp = function(val) {
      return Math.min(1, Math.max(0, val));
    };
    hue = function(h) {
      h = (h < 0 ? h + 1 : (h > 1 ? h - 1 : h));
      if (h * 6 < 1) {
        return m1 + (m2 - m1) * h * 6;
      } else if (h * 2 < 1) {
        return m2;
      } else if (h * 3 < 2) {
        return m1 + (m2 - m1) * (2 / 3 - h) * 6;
      } else {
        return m1;
      }
    };
    h = (h % 360) / 360;
    s = clamp(s / 100);
    l = clamp(l / 100);
    m2 = (l <= 0.5 ? l * (s + 1) : l + s - l * s);
    m1 = l * 2 - m2;
    return [hue(h + 1 / 3) * 255, hue(h) * 255, hue(h - 1 / 3) * 255];
  };

  rgbToHCG = function(r, g, b) {
    var c, gr, h, max, min, _ref;
    r = r / 255;
    g = g / 255;
    b = b / 255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    c = max - min;
    gr = 0;
    h = 0;
    if (c < 1) {
      gr = min / (1 - c);
    }
    if (c > 0) {
      switch (max) {
        case r:
          h = (g - b) / c + ((_ref = g < b) != null ? _ref : {
            6: 0
          });
          break;
        case g:
          h = (b - r) / c + 2;
          break;
        case b:
          h = (r - g) / c + 4;
      }
      h /= 6;
    }
    return [h * 360, c * 100, gr * 100];
  };

  hcgToRGB = function(h, c, gr) {
    var b, f, g, i, m, mod, q, r, t;
    h = h / 360 * 6;
    c = c / 100;
    gr = gr / 100;
    if (c <= 0) {
      return [gr * 255, gr * 255, gr * 255];
    }
    i = Math.floor(h);
    f = h - i;
    q = c * (1 - f);
    t = c * f;
    mod = i % 6;
    r = [c, q, 0, 0, t, c][mod];
    g = [t, c, c, q, 0, 0][mod];
    b = [0, 0, t, c, c, q][mod];
    m = (1 - c) * gr;
    return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
  };

  hsvToHWB = function(h, s, v) {
    var b, w, _ref;
    _ref = [s / 100, v / 100], s = _ref[0], v = _ref[1];
    w = (1 - s) * v;
    b = 1 - v;
    return [h, w * 100, b * 100];
  };

  hwbToHSV = function(h, w, b) {
    var s, v, _ref;
    _ref = [w / 100, b / 100], w = _ref[0], b = _ref[1];
    s = 1 - (w / (1 - b));
    v = 1 - b;
    return [h, s * 100, v * 100];
  };

  rgbToHWB = function(r, g, b) {
    return hsvToHWB.apply(null, rgbToHSV(r, g, b));
  };

  hwbToRGB = function(h, w, b) {
    return hsvToRGB.apply(null, hwbToHSV(h, w, b));
  };

  cmykToRGB = function(c, m, y, k) {
    var b, g, r;
    r = 1 - Math.min(1, c * (1 - k) + k);
    g = 1 - Math.min(1, m * (1 - k) + k);
    b = 1 - Math.min(1, y * (1 - k) + k);
    r = Math.floor(r * 255);
    g = Math.floor(g * 255);
    b = Math.floor(b * 255);
    return [r, g, b];
  };

  rgbToCMYK = function(r, g, b) {
    var computedC, computedK, computedM, computedY, minCMY;
    if (r === 0 && g === 0 && b === 0) {
      return [0, 0, 0, 1];
    }
    computedC = 1 - (r / 255);
    computedM = 1 - (g / 255);
    computedY = 1 - (b / 255);
    minCMY = Math.min(computedC, Math.min(computedM, computedY));
    computedC = (computedC - minCMY) / (1 - minCMY);
    computedM = (computedM - minCMY) / (1 - minCMY);
    computedY = (computedY - minCMY) / (1 - minCMY);
    computedK = minCMY;
    return [computedC, computedM, computedY, computedK];
  };

  module.exports = {
    cmykToRGB: cmykToRGB,
    hexARGBToRGB: hexARGBToRGB,
    hexRGBAToRGB: hexRGBAToRGB,
    hexToRGB: hexToRGB,
    hslToRGB: hslToRGB,
    hsvToHWB: hsvToHWB,
    hsvToRGB: hsvToRGB,
    hcgToRGB: hcgToRGB,
    hwbToHSV: hwbToHSV,
    hwbToRGB: hwbToRGB,
    rgbToCMYK: rgbToCMYK,
    rgbToHex: rgbToHex,
    rgbToHexARGB: rgbToHexARGB,
    rgbToHexRGBA: rgbToHexRGBA,
    rgbToHSL: rgbToHSL,
    rgbToHSV: rgbToHSV,
    rgbToHWB: rgbToHWB,
    rgbToHCG: rgbToHCG
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLWNvbnZlcnNpb25zLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQVFBO0FBQUEsTUFBQSxvTUFBQTs7QUFBQSxFQUFBLFFBQUEsR0FBWSxTQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxHQUFBO0FBQ1YsUUFBQSxVQUFBO0FBQUEsSUFBQSxHQUFBLEdBQU0sSUFBSSxDQUFDLEtBQVgsQ0FBQTtBQUFBLElBQ0EsS0FBQSxHQUFRLENBQUMsQ0FBQyxHQUFBLENBQUksQ0FBSixDQUFBLElBQVUsRUFBWCxDQUFBLEdBQWlCLENBQUMsR0FBQSxDQUFJLENBQUosQ0FBQSxJQUFVLENBQVgsQ0FBakIsR0FBaUMsR0FBQSxDQUFJLENBQUosQ0FBbEMsQ0FBeUMsQ0FBQyxRQUExQyxDQUFtRCxFQUFuRCxDQURSLENBQUE7QUFJb0IsV0FBTSxLQUFLLENBQUMsTUFBTixHQUFlLENBQXJCLEdBQUE7QUFBcEIsTUFBQSxLQUFBLEdBQVMsR0FBQSxHQUFHLEtBQVosQ0FBb0I7SUFBQSxDQUpwQjtXQU1BLE1BUFU7RUFBQSxDQUFaLENBQUE7O0FBQUEsRUFnQkEsUUFBQSxHQUFXLFNBQUMsR0FBRCxHQUFBO0FBQ1QsUUFBQSxjQUFBO0FBQUEsSUFBQSxLQUFBLEdBQVEsUUFBQSxDQUFTLEdBQVQsRUFBYyxFQUFkLENBQVIsQ0FBQTtBQUFBLElBRUEsQ0FBQSxHQUFJLENBQUMsS0FBQSxJQUFTLEVBQVYsQ0FBQSxHQUFnQixJQUZwQixDQUFBO0FBQUEsSUFHQSxDQUFBLEdBQUksQ0FBQyxLQUFBLElBQVMsQ0FBVixDQUFBLEdBQWUsSUFIbkIsQ0FBQTtBQUFBLElBSUEsQ0FBQSxHQUFJLEtBQUEsR0FBUSxJQUpaLENBQUE7V0FNQSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQVBTO0VBQUEsQ0FoQlgsQ0FBQTs7QUFBQSxFQWtDQSxZQUFBLEdBQWUsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLEdBQUE7QUFDYixRQUFBLFVBQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSxJQUFJLENBQUMsS0FBWCxDQUFBO0FBQUEsSUFDQSxLQUFBLEdBQVEsQ0FDTixDQUFDLEdBQUEsQ0FBSSxDQUFBLEdBQUksR0FBUixDQUFBLElBQWdCLEVBQWpCLENBQUEsR0FDQSxDQUFDLEdBQUEsQ0FBSSxDQUFKLENBQUEsSUFBVSxFQUFYLENBREEsR0FFQSxDQUFDLEdBQUEsQ0FBSSxDQUFKLENBQUEsSUFBVSxDQUFYLENBRkEsR0FHQSxHQUFBLENBQUksQ0FBSixDQUpNLENBS1AsQ0FBQyxRQUxNLENBS0csRUFMSCxDQURSLENBQUE7QUFTb0IsV0FBTSxLQUFLLENBQUMsTUFBTixHQUFlLENBQXJCLEdBQUE7QUFBcEIsTUFBQSxLQUFBLEdBQVMsR0FBQSxHQUFHLEtBQVosQ0FBb0I7SUFBQSxDQVRwQjtXQVdBLE1BWmE7RUFBQSxDQWxDZixDQUFBOztBQUFBLEVBeURBLFlBQUEsR0FBZSxTQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsR0FBQTtBQUNiLFFBQUEsVUFBQTtBQUFBLElBQUEsR0FBQSxHQUFNLElBQUksQ0FBQyxLQUFYLENBQUE7QUFBQSxJQUNBLEtBQUEsR0FBUSxDQUNOLENBQUMsR0FBQSxDQUFJLENBQUosQ0FBQSxJQUFVLEVBQVgsQ0FBQSxHQUNBLENBQUMsR0FBQSxDQUFJLENBQUosQ0FBQSxJQUFVLEVBQVgsQ0FEQSxHQUVBLENBQUMsR0FBQSxDQUFJLENBQUosQ0FBQSxJQUFVLENBQVgsQ0FGQSxHQUdBLEdBQUEsQ0FBSSxDQUFBLEdBQUksR0FBUixDQUpNLENBS1AsQ0FBQyxRQUxNLENBS0csRUFMSCxDQURSLENBQUE7QUFTb0IsV0FBTSxLQUFLLENBQUMsTUFBTixHQUFlLENBQXJCLEdBQUE7QUFBcEIsTUFBQSxLQUFBLEdBQVMsR0FBQSxHQUFHLEtBQVosQ0FBb0I7SUFBQSxDQVRwQjtXQVdBLE1BWmE7RUFBQSxDQXpEZixDQUFBOztBQUFBLEVBOEVBLFlBQUEsR0FBZSxTQUFDLEdBQUQsR0FBQTtBQUNiLFFBQUEsaUJBQUE7QUFBQSxJQUFBLEtBQUEsR0FBUSxRQUFBLENBQVMsR0FBVCxFQUFjLEVBQWQsQ0FBUixDQUFBO0FBQUEsSUFFQSxDQUFBLEdBQUksQ0FBQyxDQUFDLEtBQUEsSUFBUyxFQUFWLENBQUEsR0FBZ0IsSUFBakIsQ0FBQSxHQUF5QixHQUY3QixDQUFBO0FBQUEsSUFHQSxDQUFBLEdBQUksQ0FBQyxLQUFBLElBQVMsRUFBVixDQUFBLEdBQWdCLElBSHBCLENBQUE7QUFBQSxJQUlBLENBQUEsR0FBSSxDQUFDLEtBQUEsSUFBUyxDQUFWLENBQUEsR0FBZSxJQUpuQixDQUFBO0FBQUEsSUFLQSxDQUFBLEdBQUksS0FBQSxHQUFRLElBTFosQ0FBQTtXQU9BLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQVJhO0VBQUEsQ0E5RWYsQ0FBQTs7QUFBQSxFQWdHQSxZQUFBLEdBQWUsU0FBQyxHQUFELEdBQUE7QUFDYixRQUFBLGlCQUFBO0FBQUEsSUFBQSxLQUFBLEdBQVEsUUFBQSxDQUFTLEdBQVQsRUFBYyxFQUFkLENBQVIsQ0FBQTtBQUFBLElBRUEsQ0FBQSxHQUFLLENBQUMsS0FBQSxJQUFTLEVBQVYsQ0FBQSxHQUFnQixJQUZyQixDQUFBO0FBQUEsSUFHQSxDQUFBLEdBQUksQ0FBQyxLQUFBLElBQVMsRUFBVixDQUFBLEdBQWdCLElBSHBCLENBQUE7QUFBQSxJQUlBLENBQUEsR0FBSSxDQUFDLEtBQUEsSUFBUyxDQUFWLENBQUEsR0FBZSxJQUpuQixDQUFBO0FBQUEsSUFLQSxDQUFBLEdBQUksQ0FBQyxLQUFBLEdBQVEsSUFBVCxDQUFBLEdBQWlCLEdBTHJCLENBQUE7V0FPQSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFSYTtFQUFBLENBaEdmLENBQUE7O0FBQUEsRUFrSEEsUUFBQSxHQUFXLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEdBQUE7QUFFVCxRQUFBLDJEQUFBO0FBQUEsSUFBQSxDQUFBLEdBQUksQ0FBQSxHQUFJLEdBQVIsQ0FBQTtBQUFBLElBQ0EsQ0FBQSxHQUFJLENBQUEsR0FBSSxHQURSLENBQUE7QUFBQSxJQUVBLENBQUEsR0FBSSxDQUFBLEdBQUksR0FGUixDQUFBO0FBQUEsSUFHQSxHQUFBLEdBQU0sSUFBSSxDQUFDLEtBSFgsQ0FBQTtBQUFBLElBS0EsTUFBQSxHQUFTLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQVosRUFBZSxDQUFmLENBTFQsQ0FBQTtBQUFBLElBTUEsTUFBQSxHQUFTLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQVosRUFBZSxDQUFmLENBTlQsQ0FBQTtBQUFBLElBT0EsS0FBQSxHQUFRLE1BQUEsR0FBUyxNQVBqQixDQUFBO0FBQUEsSUFVQSxDQUFBLEdBQUksTUFWSixDQUFBO0FBY0EsSUFBQSxJQUFHLEtBQUEsS0FBUyxDQUFaO0FBQ0UsTUFBQSxDQUFBLEdBQUksQ0FBSixDQUFBO0FBQUEsTUFDQSxDQUFBLEdBQUksQ0FESixDQURGO0tBQUEsTUFBQTtBQU1FLE1BQUEsQ0FBQSxHQUFJLEtBQUEsR0FBUSxDQUFaLENBQUE7QUFBQSxNQUNBLE1BQUEsR0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLEdBQVUsQ0FBWCxDQUFBLEdBQWdCLENBQUMsS0FBQSxHQUFRLENBQVQsQ0FBakIsQ0FBQSxHQUFnQyxLQUR6QyxDQUFBO0FBQUEsTUFFQSxNQUFBLEdBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBQSxHQUFVLENBQVgsQ0FBQSxHQUFnQixDQUFDLEtBQUEsR0FBUSxDQUFULENBQWpCLENBQUEsR0FBZ0MsS0FGekMsQ0FBQTtBQUFBLE1BR0EsTUFBQSxHQUFTLENBQUMsQ0FBQyxDQUFDLENBQUEsR0FBSSxDQUFMLENBQUEsR0FBVSxDQUFYLENBQUEsR0FBZ0IsQ0FBQyxLQUFBLEdBQVEsQ0FBVCxDQUFqQixDQUFBLEdBQWdDLEtBSHpDLENBQUE7QUFXQSxNQUFBLElBQUcsQ0FBQSxLQUFLLENBQVI7QUFBb0IsUUFBQSxDQUFBLEdBQUksTUFBQSxHQUFTLE1BQWIsQ0FBcEI7T0FBQSxNQUNLLElBQUcsQ0FBQSxLQUFLLENBQVI7QUFBZSxRQUFBLENBQUEsR0FBSSxDQUFDLENBQUEsR0FBSSxDQUFMLENBQUEsR0FBVSxNQUFWLEdBQW1CLE1BQXZCLENBQWY7T0FBQSxNQUNBLElBQUcsQ0FBQSxLQUFLLENBQVI7QUFBZSxRQUFBLENBQUEsR0FBSSxDQUFDLENBQUEsR0FBSSxDQUFMLENBQUEsR0FBVSxNQUFWLEdBQW1CLE1BQXZCLENBQWY7T0FiTDtBQWdCQSxNQUFBLElBQVUsQ0FBQSxHQUFJLENBQWQ7QUFBQSxRQUFBLENBQUEsSUFBSyxDQUFMLENBQUE7T0FoQkE7QUFpQkEsTUFBQSxJQUFVLENBQUEsR0FBSSxDQUFkO0FBQUEsUUFBQSxDQUFBLElBQUssQ0FBTCxDQUFBO09BdkJGO0tBZEE7V0F5Q0EsQ0FBQyxDQUFBLEdBQUksR0FBTCxFQUFVLENBQUEsR0FBSSxHQUFkLEVBQW1CLENBQUEsR0FBSSxHQUF2QixFQTNDUztFQUFBLENBbEhYLENBQUE7O0FBQUEsRUF3S0EsUUFBQSxHQUFXLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEdBQUE7QUFHVCxRQUFBLG9GQUFBO0FBQUEsSUFBQSxDQUFBLEdBQUksQ0FBQSxHQUFJLEVBQVIsQ0FBQTtBQUFBLElBQ0EsQ0FBQSxHQUFJLENBQUEsR0FBSSxHQURSLENBQUE7QUFBQSxJQUVBLENBQUEsR0FBSSxDQUFBLEdBQUksR0FGUixDQUFBO0FBQUEsSUFHQSxHQUFBLEdBQU0sSUFBSSxDQUFDLEtBSFgsQ0FBQTtBQU9BLElBQUEsSUFBRyxDQUFBLEtBQUssQ0FBUjtBQUNFLGFBQU8sQ0FBQyxHQUFBLENBQUksQ0FBQSxHQUFJLEdBQVIsQ0FBRCxFQUFlLEdBQUEsQ0FBSSxDQUFBLEdBQUksR0FBUixDQUFmLEVBQTZCLEdBQUEsQ0FBSSxDQUFBLEdBQUksR0FBUixDQUE3QixDQUFQLENBREY7S0FBQSxNQUFBO0FBWUUsTUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFYLENBQVgsQ0FBQTtBQUFBLE1BRUEsS0FBQSxHQUFRLENBQUEsR0FBSSxDQUFDLENBQUEsR0FBSSxDQUFMLENBRlosQ0FBQTtBQUFBLE1BR0EsS0FBQSxHQUFRLENBQUEsR0FBSSxDQUFDLENBQUEsR0FBSSxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksUUFBTCxDQUFULENBSFosQ0FBQTtBQUFBLE1BSUEsS0FBQSxHQUFRLENBQUEsR0FBSSxDQUFDLENBQUEsR0FBSSxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksUUFBTCxDQUFMLENBQVQsQ0FKWixDQUFBO0FBUUEsY0FBTyxRQUFQO0FBQUEsYUFDTyxDQURQO0FBQ2MsVUFBQSxPQUFZLENBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxLQUFYLENBQVosRUFBQyxXQUFELEVBQUksV0FBSixFQUFPLFdBQVAsQ0FEZDtBQUNPO0FBRFAsYUFFTyxDQUZQO0FBRWMsVUFBQSxRQUFZLENBQUMsS0FBRCxFQUFRLENBQVIsRUFBVyxLQUFYLENBQVosRUFBQyxZQUFELEVBQUksWUFBSixFQUFPLFlBQVAsQ0FGZDtBQUVPO0FBRlAsYUFHTyxDQUhQO0FBR2MsVUFBQSxRQUFZLENBQUMsS0FBRCxFQUFRLENBQVIsRUFBVyxLQUFYLENBQVosRUFBQyxZQUFELEVBQUksWUFBSixFQUFPLFlBQVAsQ0FIZDtBQUdPO0FBSFAsYUFJTyxDQUpQO0FBSWMsVUFBQSxRQUFZLENBQUMsS0FBRCxFQUFRLEtBQVIsRUFBZSxDQUFmLENBQVosRUFBQyxZQUFELEVBQUksWUFBSixFQUFPLFlBQVAsQ0FKZDtBQUlPO0FBSlAsYUFLTyxDQUxQO0FBS2MsVUFBQSxRQUFZLENBQUMsS0FBRCxFQUFRLEtBQVIsRUFBZSxDQUFmLENBQVosRUFBQyxZQUFELEVBQUksWUFBSixFQUFPLFlBQVAsQ0FMZDtBQUtPO0FBTFA7QUFNYyxVQUFBLFFBQVksQ0FBQyxDQUFELEVBQUksS0FBSixFQUFXLEtBQVgsQ0FBWixFQUFDLFlBQUQsRUFBSSxZQUFKLEVBQU8sWUFBUCxDQU5kO0FBQUEsT0FSQTtBQWtCQSxhQUFPLENBQUMsQ0FBQSxHQUFJLEdBQUwsRUFBVSxDQUFBLEdBQUksR0FBZCxFQUFtQixDQUFBLEdBQUksR0FBdkIsQ0FBUCxDQTlCRjtLQVZTO0VBQUEsQ0F4S1gsQ0FBQTs7QUFBQSxFQTBOQSxRQUFBLEdBQVcsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsR0FBQTtBQUNULFFBQUEsMEJBQUE7QUFBQSxJQUFBLE9BQVUsQ0FDUixDQUFBLEdBQUksR0FESSxFQUVSLENBQUEsR0FBSSxHQUZJLEVBR1IsQ0FBQSxHQUFJLEdBSEksQ0FBVixFQUFDLFdBQUQsRUFBRyxXQUFILEVBQUssV0FBTCxDQUFBO0FBQUEsSUFLQSxHQUFBLEdBQU0sSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FMTixDQUFBO0FBQUEsSUFNQSxHQUFBLEdBQU0sSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FOTixDQUFBO0FBQUEsSUFPQSxDQUFBLEdBQUksTUFQSixDQUFBO0FBQUEsSUFRQSxDQUFBLEdBQUksTUFSSixDQUFBO0FBQUEsSUFTQSxDQUFBLEdBQUksQ0FBQyxHQUFBLEdBQU0sR0FBUCxDQUFBLEdBQWMsQ0FUbEIsQ0FBQTtBQUFBLElBVUEsQ0FBQSxHQUFJLEdBQUEsR0FBTSxHQVZWLENBQUE7QUFXQSxJQUFBLElBQUcsR0FBQSxLQUFPLEdBQVY7QUFDRSxNQUFBLENBQUEsR0FBSSxDQUFBLEdBQUksQ0FBUixDQURGO0tBQUEsTUFBQTtBQUdFLE1BQUEsQ0FBQSxHQUFJLENBQUksQ0FBQSxHQUFJLEdBQVAsR0FBZ0IsQ0FBQSxHQUFJLENBQUMsQ0FBQSxHQUFJLEdBQUosR0FBVSxHQUFYLENBQXBCLEdBQXlDLENBQUEsR0FBSSxDQUFDLEdBQUEsR0FBTSxHQUFQLENBQTlDLENBQUosQ0FBQTtBQUNBLGNBQU8sR0FBUDtBQUFBLGFBQ08sQ0FEUDtBQUVJLFVBQUEsQ0FBQSxHQUFJLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBQSxHQUFVLENBQVYsR0FBZSxDQUFJLENBQUEsR0FBSSxDQUFQLEdBQWMsQ0FBZCxHQUFxQixDQUF0QixDQUFuQixDQUZKO0FBQ087QUFEUCxhQUdPLENBSFA7QUFJSSxVQUFBLENBQUEsR0FBSSxDQUFDLENBQUEsR0FBSSxDQUFMLENBQUEsR0FBVSxDQUFWLEdBQWMsQ0FBbEIsQ0FKSjtBQUdPO0FBSFAsYUFLTyxDQUxQO0FBTUksVUFBQSxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLEdBQVUsQ0FBVixHQUFjLENBQWxCLENBTko7QUFBQSxPQURBO0FBQUEsTUFRQSxDQUFBLElBQUssQ0FSTCxDQUhGO0tBWEE7V0F3QkEsQ0FBQyxDQUFBLEdBQUksR0FBTCxFQUFVLENBQUEsR0FBSSxHQUFkLEVBQW1CLENBQUEsR0FBSSxHQUF2QixFQXpCUztFQUFBLENBMU5YLENBQUE7O0FBQUEsRUE4UEEsUUFBQSxHQUFXLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEdBQUE7QUFDVCxRQUFBLGtCQUFBO0FBQUEsSUFBQSxLQUFBLEdBQVEsU0FBQyxHQUFELEdBQUE7YUFBUyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxHQUFaLENBQVosRUFBVDtJQUFBLENBQVIsQ0FBQTtBQUFBLElBRUEsR0FBQSxHQUFNLFNBQUMsQ0FBRCxHQUFBO0FBQ0osTUFBQSxDQUFBLEdBQUksQ0FBSSxDQUFBLEdBQUksQ0FBUCxHQUFjLENBQUEsR0FBSSxDQUFsQixHQUEwQixDQUFJLENBQUEsR0FBSSxDQUFQLEdBQWMsQ0FBQSxHQUFJLENBQWxCLEdBQXlCLENBQTFCLENBQTNCLENBQUosQ0FBQTtBQUNBLE1BQUEsSUFBRyxDQUFBLEdBQUksQ0FBSixHQUFRLENBQVg7ZUFDRSxFQUFBLEdBQUssQ0FBQyxFQUFBLEdBQUssRUFBTixDQUFBLEdBQVksQ0FBWixHQUFnQixFQUR2QjtPQUFBLE1BRUssSUFBRyxDQUFBLEdBQUksQ0FBSixHQUFRLENBQVg7ZUFDSCxHQURHO09BQUEsTUFFQSxJQUFHLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBWDtlQUNILEVBQUEsR0FBSyxDQUFDLEVBQUEsR0FBSyxFQUFOLENBQUEsR0FBWSxDQUFDLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBVCxDQUFaLEdBQTBCLEVBRDVCO09BQUEsTUFBQTtlQUdILEdBSEc7T0FORDtJQUFBLENBRk4sQ0FBQTtBQUFBLElBYUEsQ0FBQSxHQUFJLENBQUMsQ0FBQSxHQUFJLEdBQUwsQ0FBQSxHQUFZLEdBYmhCLENBQUE7QUFBQSxJQWNBLENBQUEsR0FBSSxLQUFBLENBQU0sQ0FBQSxHQUFJLEdBQVYsQ0FkSixDQUFBO0FBQUEsSUFlQSxDQUFBLEdBQUksS0FBQSxDQUFNLENBQUEsR0FBSSxHQUFWLENBZkosQ0FBQTtBQUFBLElBZ0JBLEVBQUEsR0FBSyxDQUFJLENBQUEsSUFBSyxHQUFSLEdBQWlCLENBQUEsR0FBSSxDQUFDLENBQUEsR0FBSSxDQUFMLENBQXJCLEdBQWtDLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBQSxHQUFJLENBQS9DLENBaEJMLENBQUE7QUFBQSxJQWlCQSxFQUFBLEdBQUssQ0FBQSxHQUFJLENBQUosR0FBUSxFQWpCYixDQUFBO0FBbUJBLFdBQU8sQ0FDTCxHQUFBLENBQUksQ0FBQSxHQUFJLENBQUEsR0FBSSxDQUFaLENBQUEsR0FBaUIsR0FEWixFQUVMLEdBQUEsQ0FBSSxDQUFKLENBQUEsR0FBUyxHQUZKLEVBR0wsR0FBQSxDQUFJLENBQUEsR0FBSSxDQUFBLEdBQUksQ0FBWixDQUFBLEdBQWlCLEdBSFosQ0FBUCxDQXBCUztFQUFBLENBOVBYLENBQUE7O0FBQUEsRUFnU0EsUUFBQSxHQUFXLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEdBQUE7QUFDVCxRQUFBLHdCQUFBO0FBQUEsSUFBQSxDQUFBLEdBQUksQ0FBQSxHQUFJLEdBQVIsQ0FBQTtBQUFBLElBQ0EsQ0FBQSxHQUFJLENBQUEsR0FBSSxHQURSLENBQUE7QUFBQSxJQUVBLENBQUEsR0FBSSxDQUFBLEdBQUksR0FGUixDQUFBO0FBQUEsSUFHQSxHQUFBLEdBQU0sSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FITixDQUFBO0FBQUEsSUFJQSxHQUFBLEdBQU0sSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FKTixDQUFBO0FBQUEsSUFLQSxDQUFBLEdBQUssR0FBQSxHQUFNLEdBTFgsQ0FBQTtBQUFBLElBTUEsRUFBQSxHQUFLLENBTkwsQ0FBQTtBQUFBLElBT0EsQ0FBQSxHQUFJLENBUEosQ0FBQTtBQVNBLElBQUEsSUFBSSxDQUFBLEdBQUksQ0FBUjtBQUNFLE1BQUEsRUFBQSxHQUFLLEdBQUEsR0FBTSxDQUFDLENBQUEsR0FBSSxDQUFMLENBQVgsQ0FERjtLQVRBO0FBWUEsSUFBQSxJQUFJLENBQUEsR0FBSSxDQUFSO0FBQ0UsY0FBUSxHQUFSO0FBQUEsYUFDTyxDQURQO0FBRUksVUFBQSxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLEdBQVUsQ0FBVixHQUFjLGlDQUFTO0FBQUEsWUFBQSxDQUFBLEVBQUksQ0FBSjtXQUFULENBQWxCLENBRko7QUFDTztBQURQLGFBR08sQ0FIUDtBQUlJLFVBQUEsQ0FBQSxHQUFJLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBQSxHQUFVLENBQVYsR0FBYyxDQUFsQixDQUpKO0FBR087QUFIUCxhQUtPLENBTFA7QUFNSSxVQUFBLENBQUEsR0FBSSxDQUFDLENBQUEsR0FBSSxDQUFMLENBQUEsR0FBVSxDQUFWLEdBQWMsQ0FBbEIsQ0FOSjtBQUFBLE9BQUE7QUFBQSxNQU9BLENBQUEsSUFBSyxDQVBMLENBREY7S0FaQTtXQXNCQSxDQUFDLENBQUEsR0FBSSxHQUFMLEVBQVUsQ0FBQSxHQUFJLEdBQWQsRUFBbUIsRUFBQSxHQUFLLEdBQXhCLEVBdkJTO0VBQUEsQ0FoU1gsQ0FBQTs7QUFBQSxFQWtVQSxRQUFBLEdBQVcsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLEVBQVAsR0FBQTtBQUNULFFBQUEsMkJBQUE7QUFBQSxJQUFBLENBQUEsR0FBSyxDQUFBLEdBQUksR0FBSixHQUFVLENBQWYsQ0FBQTtBQUFBLElBQ0EsQ0FBQSxHQUFLLENBQUEsR0FBSSxHQURULENBQUE7QUFBQSxJQUVBLEVBQUEsR0FBSyxFQUFBLEdBQUssR0FGVixDQUFBO0FBSUEsSUFBQSxJQUFJLENBQUEsSUFBSyxDQUFUO0FBQ0UsYUFBTyxDQUFDLEVBQUEsR0FBSyxHQUFOLEVBQVcsRUFBQSxHQUFLLEdBQWhCLEVBQXFCLEVBQUEsR0FBSyxHQUExQixDQUFQLENBREY7S0FKQTtBQUFBLElBT0EsQ0FBQSxHQUFJLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBWCxDQVBKLENBQUE7QUFBQSxJQVFBLENBQUEsR0FBSSxDQUFBLEdBQUksQ0FSUixDQUFBO0FBQUEsSUFTQSxDQUFBLEdBQUksQ0FBQSxHQUFJLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FUUixDQUFBO0FBQUEsSUFVQSxDQUFBLEdBQUksQ0FBQSxHQUFJLENBVlIsQ0FBQTtBQUFBLElBV0EsR0FBQSxHQUFNLENBQUEsR0FBSSxDQVhWLENBQUE7QUFBQSxJQVlBLENBQUEsR0FBSSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLENBQWhCLENBQW1CLENBQUEsR0FBQSxDQVp2QixDQUFBO0FBQUEsSUFhQSxDQUFBLEdBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixDQUFoQixDQUFtQixDQUFBLEdBQUEsQ0FidkIsQ0FBQTtBQUFBLElBY0EsQ0FBQSxHQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsQ0FBbUIsQ0FBQSxHQUFBLENBZHZCLENBQUE7QUFBQSxJQWVBLENBQUEsR0FBSSxDQUFDLENBQUEsR0FBSSxDQUFMLENBQUEsR0FBVSxFQWZkLENBQUE7V0FpQkEsQ0FDRSxDQUFDLENBQUEsR0FBSSxDQUFMLENBQUEsR0FBVSxHQURaLEVBRUUsQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLEdBQVUsR0FGWixFQUdFLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBQSxHQUFVLEdBSFosRUFsQlM7RUFBQSxDQWxVWCxDQUFBOztBQUFBLEVBaVdBLFFBQUEsR0FBVyxTQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxHQUFBO0FBQ1QsUUFBQSxVQUFBO0FBQUEsSUFBQSxPQUFRLENBQUMsQ0FBQSxHQUFJLEdBQUwsRUFBVSxDQUFBLEdBQUksR0FBZCxDQUFSLEVBQUMsV0FBRCxFQUFHLFdBQUgsQ0FBQTtBQUFBLElBRUEsQ0FBQSxHQUFJLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBQSxHQUFVLENBRmQsQ0FBQTtBQUFBLElBR0EsQ0FBQSxHQUFJLENBQUEsR0FBSSxDQUhSLENBQUE7V0FLQSxDQUFDLENBQUQsRUFBSSxDQUFBLEdBQUksR0FBUixFQUFhLENBQUEsR0FBSSxHQUFqQixFQU5TO0VBQUEsQ0FqV1gsQ0FBQTs7QUFBQSxFQWdYQSxRQUFBLEdBQVcsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsR0FBQTtBQUNULFFBQUEsVUFBQTtBQUFBLElBQUEsT0FBUSxDQUFDLENBQUEsR0FBSSxHQUFMLEVBQVUsQ0FBQSxHQUFJLEdBQWQsQ0FBUixFQUFDLFdBQUQsRUFBRyxXQUFILENBQUE7QUFBQSxJQUVBLENBQUEsR0FBSSxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFMLENBRlIsQ0FBQTtBQUFBLElBR0EsQ0FBQSxHQUFJLENBQUEsR0FBSSxDQUhSLENBQUE7V0FLQSxDQUFDLENBQUQsRUFBSSxDQUFBLEdBQUksR0FBUixFQUFhLENBQUEsR0FBSSxHQUFqQixFQU5TO0VBQUEsQ0FoWFgsQ0FBQTs7QUFBQSxFQWlZQSxRQUFBLEdBQVcsU0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsR0FBQTtXQUFXLFFBQUEsYUFBUyxRQUFBLENBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYSxDQUFiLENBQVQsRUFBWDtFQUFBLENBallYLENBQUE7O0FBQUEsRUE0WUEsUUFBQSxHQUFXLFNBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEdBQUE7V0FBVyxRQUFBLGFBQVMsUUFBQSxDQUFTLENBQVQsRUFBVyxDQUFYLEVBQWEsQ0FBYixDQUFULEVBQVg7RUFBQSxDQTVZWCxDQUFBOztBQUFBLEVBK1lBLFNBQUEsR0FBWSxTQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFPLENBQVAsR0FBQTtBQUNWLFFBQUEsT0FBQTtBQUFBLElBQUEsQ0FBQSxHQUFJLENBQUEsR0FBSSxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFKLEdBQWMsQ0FBMUIsQ0FBUixDQUFBO0FBQUEsSUFDQSxDQUFBLEdBQUksQ0FBQSxHQUFJLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQUEsR0FBSSxDQUFDLENBQUEsR0FBSSxDQUFMLENBQUosR0FBYyxDQUExQixDQURSLENBQUE7QUFBQSxJQUVBLENBQUEsR0FBSSxDQUFBLEdBQUksSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksQ0FBQSxHQUFJLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBSixHQUFjLENBQTFCLENBRlIsQ0FBQTtBQUFBLElBSUEsQ0FBQSxHQUFJLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBQSxHQUFJLEdBQWYsQ0FKSixDQUFBO0FBQUEsSUFLQSxDQUFBLEdBQUksSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFBLEdBQUksR0FBZixDQUxKLENBQUE7QUFBQSxJQU1BLENBQUEsR0FBSSxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUEsR0FBSSxHQUFmLENBTkosQ0FBQTtXQVFBLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBVFU7RUFBQSxDQS9ZWixDQUFBOztBQUFBLEVBNFpBLFNBQUEsR0FBWSxTQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxHQUFBO0FBRVYsUUFBQSxrREFBQTtBQUFBLElBQUEsSUFBdUIsQ0FBQSxLQUFLLENBQUwsSUFBVyxDQUFBLEtBQUssQ0FBaEIsSUFBc0IsQ0FBQSxLQUFLLENBQWxEO0FBQUEsYUFBTyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsQ0FBUCxDQUFBO0tBQUE7QUFBQSxJQUVBLFNBQUEsR0FBWSxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksR0FBTCxDQUZoQixDQUFBO0FBQUEsSUFHQSxTQUFBLEdBQVksQ0FBQSxHQUFJLENBQUMsQ0FBQSxHQUFJLEdBQUwsQ0FIaEIsQ0FBQTtBQUFBLElBSUEsU0FBQSxHQUFZLENBQUEsR0FBSSxDQUFDLENBQUEsR0FBSSxHQUFMLENBSmhCLENBQUE7QUFBQSxJQU1BLE1BQUEsR0FBUyxJQUFJLENBQUMsR0FBTCxDQUFTLFNBQVQsRUFBb0IsSUFBSSxDQUFDLEdBQUwsQ0FBUyxTQUFULEVBQW9CLFNBQXBCLENBQXBCLENBTlQsQ0FBQTtBQUFBLElBUUEsU0FBQSxHQUFZLENBQUMsU0FBQSxHQUFZLE1BQWIsQ0FBQSxHQUF1QixDQUFDLENBQUEsR0FBSSxNQUFMLENBUm5DLENBQUE7QUFBQSxJQVNBLFNBQUEsR0FBWSxDQUFDLFNBQUEsR0FBWSxNQUFiLENBQUEsR0FBdUIsQ0FBQyxDQUFBLEdBQUksTUFBTCxDQVRuQyxDQUFBO0FBQUEsSUFVQSxTQUFBLEdBQVksQ0FBQyxTQUFBLEdBQVksTUFBYixDQUFBLEdBQXVCLENBQUMsQ0FBQSxHQUFJLE1BQUwsQ0FWbkMsQ0FBQTtBQUFBLElBV0EsU0FBQSxHQUFZLE1BWFosQ0FBQTtXQWFBLENBQUMsU0FBRCxFQUFZLFNBQVosRUFBdUIsU0FBdkIsRUFBa0MsU0FBbEMsRUFmVTtFQUFBLENBNVpaLENBQUE7O0FBQUEsRUE2YUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBQSxJQUNmLFdBQUEsU0FEZTtBQUFBLElBRWYsY0FBQSxZQUZlO0FBQUEsSUFHZixjQUFBLFlBSGU7QUFBQSxJQUlmLFVBQUEsUUFKZTtBQUFBLElBS2YsVUFBQSxRQUxlO0FBQUEsSUFNZixVQUFBLFFBTmU7QUFBQSxJQU9mLFVBQUEsUUFQZTtBQUFBLElBUWYsVUFBQSxRQVJlO0FBQUEsSUFTZixVQUFBLFFBVGU7QUFBQSxJQVVmLFVBQUEsUUFWZTtBQUFBLElBV2YsV0FBQSxTQVhlO0FBQUEsSUFZZixVQUFBLFFBWmU7QUFBQSxJQWFmLGNBQUEsWUFiZTtBQUFBLElBY2YsY0FBQSxZQWRlO0FBQUEsSUFlZixVQUFBLFFBZmU7QUFBQSxJQWdCZixVQUFBLFFBaEJlO0FBQUEsSUFpQmYsVUFBQSxRQWpCZTtBQUFBLElBa0JmLFVBQUEsUUFsQmU7R0E3YWpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/pigments/lib/color-conversions.coffee
