var _self =
    "undefined" != typeof window
      ? window
      : "undefined" != typeof WorkerGlobalScope &&
        self instanceof WorkerGlobalScope
      ? self
      : {},
  Prism = (function (e) {
    function t(e, t, n, a, r) {
      (this.type = e),
        (this.content = t),
        (this.alias = n),
        (this.length = 0 | (a || "").length),
        (this.greedy = !!r);
    }
    var n = /\blang(?:uage)?-([\w-]+)\b/i,
      a = 0,
      r = {
        manual: e.Prism && e.Prism.manual,
        disableWorkerMessageHandler:
          e.Prism && e.Prism.disableWorkerMessageHandler,
        util: {
          encode: function (e) {
            return e instanceof t
              ? new t(e.type, r.util.encode(e.content), e.alias)
              : "Array" === r.util.type(e)
              ? e.map(r.util.encode)
              : e
                  .replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/\u00a0/g, " ");
          },
          type: function (e) {
            return Object.prototype.toString.call(e).slice(8, -1);
          },
          objId: function (e) {
            return (
              e.__id || Object.defineProperty(e, "__id", { value: ++a }), e.__id
            );
          },
          clone: function e(t, n) {
            var a,
              i,
              s = r.util.type(t);
            switch (((n = n || {}), s)) {
              case "Object":
                if (((i = r.util.objId(t)), n[i])) return n[i];
                for (var l in ((a = {}), (n[i] = a), t))
                  t.hasOwnProperty(l) && (a[l] = e(t[l], n));
                return a;
              case "Array":
                return (
                  (i = r.util.objId(t)),
                  n[i]
                    ? n[i]
                    : ((a = []),
                      (n[i] = a),
                      t.forEach(function (t, r) {
                        a[r] = e(t, n);
                      }),
                      a)
                );
              default:
                return t;
            }
          },
        },
        languages: {
          extend: function (e, t) {
            var n = r.util.clone(r.languages[e]);
            for (var a in t) n[a] = t[a];
            return n;
          },
          insertBefore: function (e, t, n, a) {
            var i = (a = a || r.languages)[e],
              s = {};
            for (var l in i)
              if (i.hasOwnProperty(l)) {
                if (l == t)
                  for (var o in n) n.hasOwnProperty(o) && (s[o] = n[o]);
                n.hasOwnProperty(l) || (s[l] = i[l]);
              }
            var u = a[e];
            return (
              (a[e] = s),
              r.languages.DFS(r.languages, function (t, n) {
                n === u && t != e && (this[t] = s);
              }),
              s
            );
          },
          DFS: function e(t, n, a, i) {
            i = i || {};
            var s = r.util.objId;
            for (var l in t)
              if (t.hasOwnProperty(l)) {
                n.call(t, l, t[l], a || l);
                var o = t[l],
                  u = r.util.type(o);
                "Object" !== u || i[s(o)]
                  ? "Array" !== u || i[s(o)] || ((i[s(o)] = !0), e(o, n, l, i))
                  : ((i[s(o)] = !0), e(o, n, null, i));
              }
          },
        },
        plugins: {},
        highlightAll: function (e, t) {
          r.highlightAllUnder(document, e, t);
        },
        highlightAllUnder: function (e, t, n) {
          var a = {
            callback: n,
            selector:
              'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
          };
          r.hooks.run("before-highlightall", a);
          for (
            var i, s = a.elements || e.querySelectorAll(a.selector), l = 0;
            (i = s[l++]);

          )
            r.highlightElement(i, !0 === t, a.callback);
        },
        highlightElement: function (t, a, i) {
          for (var s, l, o = t; o && !n.test(o.className); ) o = o.parentNode;
          o &&
            ((s = (o.className.match(n) || [, ""])[1].toLowerCase()),
            (l = r.languages[s])),
            (t.className =
              t.className.replace(n, "").replace(/\s+/g, " ") +
              " language-" +
              s),
            t.parentNode &&
              ((o = t.parentNode),
              /pre/i.test(o.nodeName) &&
                (o.className =
                  o.className.replace(n, "").replace(/\s+/g, " ") +
                  " language-" +
                  s));
          var u = { element: t, language: s, grammar: l, code: t.textContent },
            c = function (e) {
              (u.highlightedCode = e),
                r.hooks.run("before-insert", u),
                (u.element.innerHTML = u.highlightedCode),
                r.hooks.run("after-highlight", u),
                r.hooks.run("complete", u),
                i && i.call(u.element);
            };
          if ((r.hooks.run("before-sanity-check", u), u.code))
            if ((r.hooks.run("before-highlight", u), u.grammar))
              if (a && e.Worker) {
                var d = new Worker(r.filename);
                (d.onmessage = function (e) {
                  c(e.data);
                }),
                  d.postMessage(
                    JSON.stringify({
                      language: u.language,
                      code: u.code,
                      immediateClose: !0,
                    })
                  );
              } else c(r.highlight(u.code, u.grammar, u.language));
            else c(r.util.encode(u.code));
          else r.hooks.run("complete", u);
        },
        highlight: function (e, n, a) {
          var i = { code: e, grammar: n, language: a };
          return (
            r.hooks.run("before-tokenize", i),
            (i.tokens = r.tokenize(i.code, i.grammar)),
            r.hooks.run("after-tokenize", i),
            t.stringify(r.util.encode(i.tokens), i.language)
          );
        },
        matchGrammar: function (e, n, a, i, s, l, o) {
          for (var u in a)
            if (a.hasOwnProperty(u) && a[u]) {
              if (u == o) return;
              var c = a[u];
              c = "Array" === r.util.type(c) ? c : [c];
              for (var d = 0; d < c.length; ++d) {
                var g = c[d],
                  p = g.inside,
                  m = !!g.lookbehind,
                  f = !!g.greedy,
                  h = 0,
                  y = g.alias;
                if (f && !g.pattern.global) {
                  var b = g.pattern.toString().match(/[imuy]*$/)[0];
                  g.pattern = RegExp(g.pattern.source, b + "g");
                }
                g = g.pattern || g;
                for (var v = i, F = s; v < n.length; F += n[v].length, ++v) {
                  var k = n[v];
                  if (n.length > e.length) return;
                  if (!(k instanceof t)) {
                    if (f && v != n.length - 1) {
                      if (((g.lastIndex = F), !(N = g.exec(e)))) break;
                      for (
                        var A = N.index + (m ? N[1].length : 0),
                          w = N.index + N[0].length,
                          P = v,
                          x = F,
                          S = n.length;
                        P < S && (x < w || (!n[P].type && !n[P - 1].greedy));
                        ++P
                      )
                        (x += n[P].length) <= A && (++v, (F = x));
                      if (n[v] instanceof t) continue;
                      (C = P - v), (k = e.slice(F, x)), (N.index -= F);
                    } else {
                      g.lastIndex = 0;
                      var N = g.exec(k),
                        C = 1;
                    }
                    if (N) {
                      m && (h = N[1] ? N[1].length : 0),
                        (w = (A = N.index + h) + (N = N[0].slice(h)).length);
                      var E = k.slice(0, A),
                        j = k.slice(w),
                        _ = [v, C];
                      E && (++v, (F += E.length), _.push(E));
                      var z = new t(u, p ? r.tokenize(N, p) : N, y, N, f);
                      if (
                        (_.push(z),
                        j && _.push(j),
                        Array.prototype.splice.apply(n, _),
                        1 != C && r.matchGrammar(e, n, a, v, F, !0, u),
                        l)
                      )
                        break;
                    } else if (l) break;
                  }
                }
              }
            }
        },
        tokenize: function (e, t) {
          var n = [e],
            a = t.rest;
          if (a) {
            for (var i in a) t[i] = a[i];
            delete t.rest;
          }
          return r.matchGrammar(e, n, t, 0, 0, !1), n;
        },
        hooks: {
          all: {},
          add: function (e, t) {
            var n = r.hooks.all;
            (n[e] = n[e] || []), n[e].push(t);
          },
          run: function (e, t) {
            var n = r.hooks.all[e];
            if (n && n.length) for (var a, i = 0; (a = n[i++]); ) a(t);
          },
        },
        Token: t,
      };
    if (
      ((e.Prism = r),
      (t.stringify = function (e, n, a) {
        if ("string" == typeof e) return e;
        if ("Array" === r.util.type(e))
          return e
            .map(function (a) {
              return t.stringify(a, n, e);
            })
            .join("");
        var i = {
          type: e.type,
          content: t.stringify(e.content, n, a),
          tag: "span",
          classes: ["token", e.type],
          attributes: {},
          language: n,
          parent: a,
        };
        if (e.alias) {
          var s = "Array" === r.util.type(e.alias) ? e.alias : [e.alias];
          Array.prototype.push.apply(i.classes, s);
        }
        r.hooks.run("wrap", i);
        var l = Object.keys(i.attributes)
          .map(function (e) {
            return (
              e + '="' + (i.attributes[e] || "").replace(/"/g, "&quot;") + '"'
            );
          })
          .join(" ");
        return (
          "<" +
          i.tag +
          ' class="' +
          i.classes.join(" ") +
          '"' +
          (l ? " " + l : "") +
          ">" +
          i.content +
          "</" +
          i.tag +
          ">"
        );
      }),
      !e.document)
    )
      return (
        e.addEventListener &&
          (r.disableWorkerMessageHandler ||
            e.addEventListener(
              "message",
              function (t) {
                var n = JSON.parse(t.data),
                  a = n.language,
                  i = n.code,
                  s = n.immediateClose;
                e.postMessage(r.highlight(i, r.languages[a], a)),
                  s && e.close();
              },
              !1
            )),
        r
      );
    var i =
      document.currentScript ||
      [].slice.call(document.getElementsByTagName("script")).pop();
    return (
      i &&
        ((r.filename = i.src),
        r.manual ||
          i.hasAttribute("data-manual") ||
          ("loading" !== document.readyState
            ? window.requestAnimationFrame
              ? window.requestAnimationFrame(r.highlightAll)
              : window.setTimeout(r.highlightAll, 16)
            : document.addEventListener("DOMContentLoaded", r.highlightAll))),
      r
    );
  })(_self);
"undefined" != typeof module && module.exports && (module.exports = Prism),
  "undefined" != typeof global && (global.Prism = Prism),
  (Prism.languages.markup = {
    comment: /<!--[\s\S]*?-->/,
    prolog: /<\?[\s\S]+?\?>/,
    doctype: /<!DOCTYPE[\s\S]+?>/i,
    cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
    tag: {
      pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s\/>])))+)?\s*\/?>/i,
      greedy: !0,
      inside: {
        tag: {
          pattern: /^<\/?[^\s>\/]+/i,
          inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ },
        },
        "attr-value": {
          pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
          inside: {
            punctuation: [
              /^=/,
              { pattern: /^(\s*)["']|["']$/, lookbehind: !0 },
            ],
          },
        },
        punctuation: /\/?>/,
        "attr-name": {
          pattern: /[^\s>\/]+/,
          inside: { namespace: /^[^\s>\/:]+:/ },
        },
      },
    },
    entity: /&#?[\da-z]{1,8};/i,
  }),
  (Prism.languages.markup.tag.inside["attr-value"].inside.entity =
    Prism.languages.markup.entity),
  Prism.hooks.add("wrap", function (e) {
    "entity" === e.type &&
      (e.attributes.title = e.content.replace(/&amp;/, "&"));
  }),
  Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
    value: function (e, t) {
      var n = {};
      (n["language-" + t] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: !0,
        inside: Prism.languages[t],
      }),
        (n.cdata = /^<!\[CDATA\[|\]\]>$/i);
      var a = {
        "included-cdata": { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, inside: n },
      };
      a["language-" + t] = { pattern: /[\s\S]+/, inside: Prism.languages[t] };
      var r = {};
      (r[e] = {
        pattern: RegExp(
          "(<__[\\s\\S]*?>)(?:<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\s*|[\\s\\S])*?(?=<\\/__>)".replace(
            /__/g,
            e
          ),
          "i"
        ),
        lookbehind: !0,
        greedy: !0,
        inside: a,
      }),
        Prism.languages.insertBefore("markup", "cdata", r);
    },
  }),
  (Prism.languages.xml = Prism.languages.extend("markup", {})),
  (Prism.languages.html = Prism.languages.markup),
  (Prism.languages.mathml = Prism.languages.markup),
  (Prism.languages.svg = Prism.languages.markup),
  (function (e) {
    var t = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
    (e.languages.css = {
      comment: /\/\*[\s\S]*?\*\//,
      atrule: {
        pattern: /@[\w-]+?[\s\S]*?(?:;|(?=\s*\{))/i,
        inside: { rule: /@[\w-]+/ },
      },
      url: RegExp("url\\((?:" + t.source + "|.*?)\\)", "i"),
      selector: RegExp("[^{}\\s](?:[^{};\"']|" + t.source + ")*?(?=\\s*\\{)"),
      string: { pattern: t, greedy: !0 },
      property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
      important: /!important\b/i,
      function: /[-a-z0-9]+(?=\()/i,
      punctuation: /[(){};:,]/,
    }),
      (e.languages.css.atrule.inside.rest = e.languages.css);
    var n = e.languages.markup;
    n &&
      (n.tag.addInlined("style", "css"),
      e.languages.insertBefore(
        "inside",
        "attr-value",
        {
          "style-attr": {
            pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
            inside: {
              "attr-name": { pattern: /^\s*style/i, inside: n.tag.inside },
              punctuation: /^\s*=\s*['"]|['"]\s*$/,
              "attr-value": { pattern: /.+/i, inside: e.languages.css },
            },
            alias: "language-css",
          },
        },
        n.tag
      ));
  })(Prism),
  (Prism.languages.clike = {
    comment: [
      { pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: !0 },
      { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 },
    ],
    string: {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: !0,
    },
    "class-name": {
      pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
      lookbehind: !0,
      inside: { punctuation: /[.\\]/ },
    },
    keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    boolean: /\b(?:true|false)\b/,
    function: /\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
    punctuation: /[{}[\];(),.:]/,
  }),
  (Prism.languages.javascript = Prism.languages.extend("clike", {
    "class-name": [
      Prism.languages.clike["class-name"],
      {
        pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
        lookbehind: !0,
      },
    ],
    keyword: [
      { pattern: /((?:^|})\s*)(?:catch|finally)\b/, lookbehind: !0 },
      /\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
    ],
    number: /\b(?:(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+)n?|\d+n|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
    function: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/,
  })),
  (Prism.languages.javascript[
    "class-name"
  ][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/),
  Prism.languages.insertBefore("javascript", "keyword", {
    regex: {
      pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^\/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})\]]))/,
      lookbehind: !0,
      greedy: !0,
    },
    "function-variable": {
      pattern: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
      alias: "function",
    },
    parameter: [
      {
        pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
      {
        pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
        inside: Prism.languages.javascript,
      },
      {
        pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
      {
        pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
    ],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
  }),
  Prism.languages.insertBefore("javascript", "string", {
    "template-string": {
      pattern: /`(?:\\[\s\S]|\${[^}]+}|[^\\`])*`/,
      greedy: !0,
      inside: {
        interpolation: {
          pattern: /\${[^}]+}/,
          inside: {
            "interpolation-punctuation": {
              pattern: /^\${|}$/,
              alias: "punctuation",
            },
            rest: Prism.languages.javascript,
          },
        },
        string: /[\s\S]+/,
      },
    },
  }),
  Prism.languages.markup &&
    Prism.languages.markup.tag.addInlined("script", "javascript"),
  (Prism.languages.js = Prism.languages.javascript),
  (function () {
    function e(e, t) {
      return Array.prototype.slice.call((t || document).querySelectorAll(e));
    }
    function t(e, t) {
      return (
        (t = " " + t + " "),
        -1 < (" " + e.className + " ").replace(/[\n\t]/g, " ").indexOf(t)
      );
    }
    function n(e, n, a) {
      for (
        var r,
          s = (n = "string" == typeof n ? n : e.getAttribute("data-line"))
            .replace(/\s+/g, "")
            .split(","),
          l = +e.getAttribute("data-line-offset") || 0,
          o = (i() ? parseInt : parseFloat)(getComputedStyle(e).lineHeight),
          u = t(e, "line-numbers"),
          c = 0;
        (r = s[c++]);

      ) {
        var d = r.split("-"),
          g = +d[0],
          p = +d[1] || g,
          m =
            e.querySelector('.line-highlight[data-range="' + r + '"]') ||
            document.createElement("div");
        if (
          (m.setAttribute("aria-hidden", "true"),
          m.setAttribute("data-range", r),
          (m.className = (a || "") + " line-highlight"),
          u && Prism.plugins.lineNumbers)
        ) {
          var f = Prism.plugins.lineNumbers.getLine(e, g),
            h = Prism.plugins.lineNumbers.getLine(e, p);
          f && (m.style.top = f.offsetTop + "px"),
            h &&
              (m.style.height =
                h.offsetTop - f.offsetTop + h.offsetHeight + "px");
        } else
          m.setAttribute("data-start", g),
            g < p && m.setAttribute("data-end", p),
            (m.style.top = (g - l - 1) * o + "px"),
            (m.textContent = new Array(p - g + 2).join(" \n"));
        u ? e.appendChild(m) : (e.querySelector("code") || e).appendChild(m);
      }
    }
    function a() {
      var t = location.hash.slice(1);
      e(".temporary.line-highlight").forEach(function (e) {
        e.parentNode.removeChild(e);
      });
      var a = (t.match(/\.([\d,-]+)$/) || [, ""])[1];
      if (a && !document.getElementById(t)) {
        var r = t.slice(0, t.lastIndexOf(".")),
          i = document.getElementById(r);
        i &&
          (i.hasAttribute("data-line") || i.setAttribute("data-line", ""),
          n(i, a, "temporary "),
          document.querySelector(".temporary.line-highlight").scrollIntoView());
      }
    }
    if (
      "undefined" != typeof self &&
      self.Prism &&
      self.document &&
      document.querySelector
    ) {
      var r,
        i = function () {
          if (void 0 === r) {
            var e = document.createElement("div");
            (e.style.fontSize = "13px"),
              (e.style.lineHeight = "1.5"),
              (e.style.padding = 0),
              (e.style.border = 0),
              (e.innerHTML = "&nbsp;<br />&nbsp;"),
              document.body.appendChild(e),
              (r = 38 === e.offsetHeight),
              document.body.removeChild(e);
          }
          return r;
        },
        s = 0;
      Prism.hooks.add("before-sanity-check", function (t) {
        var n = t.element.parentNode,
          a = n && n.getAttribute("data-line");
        if (n && a && /pre/i.test(n.nodeName)) {
          var r = 0;
          e(".line-highlight", n).forEach(function (e) {
            (r += e.textContent.length), e.parentNode.removeChild(e);
          }),
            r &&
              /^( \n)+$/.test(t.code.slice(-r)) &&
              (t.code = t.code.slice(0, -r));
        }
      }),
        Prism.hooks.add("complete", function e(r) {
          var i = r.element.parentNode,
            l = i && i.getAttribute("data-line");
          if (i && l && /pre/i.test(i.nodeName)) {
            clearTimeout(s);
            var o = Prism.plugins.lineNumbers,
              u = r.plugins && r.plugins.lineNumbers;
            t(i, "line-numbers") && o && !u
              ? Prism.hooks.add("line-numbers", e)
              : (n(i, l), (s = setTimeout(a, 1)));
          }
        }),
        window.addEventListener("hashchange", a),
        window.addEventListener("resize", function () {
          var e = document.querySelectorAll("pre[data-line]");
          Array.prototype.forEach.call(e, function (e) {
            n(e);
          });
        });
    }
  })(),
  (function () {
    if ("undefined" != typeof self && self.Prism && self.document) {
      var e = "line-numbers",
        t = /\n(?!$)/g,
        n = function (e) {
          var n = a(e)["white-space"];
          if ("pre-wrap" === n || "pre-line" === n) {
            var r = e.querySelector("code"),
              i = e.querySelector(".line-numbers-rows"),
              s = e.querySelector(".line-numbers-sizer"),
              l = r.textContent.split(t);
            s ||
              (((s = document.createElement("span")).className =
                "line-numbers-sizer"),
              r.appendChild(s)),
              (s.style.display = "block"),
              l.forEach(function (e, t) {
                s.textContent = e || "\n";
                var n = s.getBoundingClientRect().height;
                i.children[t].style.height = n + "px";
              }),
              (s.textContent = ""),
              (s.style.display = "none");
          }
        },
        a = function (e) {
          return e
            ? window.getComputedStyle
              ? getComputedStyle(e)
              : e.currentStyle || null
            : null;
        };
      window.addEventListener("resize", function () {
        Array.prototype.forEach.call(document.querySelectorAll("pre." + e), n);
      }),
        Prism.hooks.add("complete", function (e) {
          if (e.code) {
            var a = e.element,
              r = a.parentNode;
            if (
              r &&
              /pre/i.test(r.nodeName) &&
              !a.querySelector(".line-numbers-rows")
            ) {
              for (
                var i = !1, s = /(?:^|\s)line-numbers(?:\s|$)/, l = a;
                l;
                l = l.parentNode
              )
                if (s.test(l.className)) {
                  i = !0;
                  break;
                }
              if (i) {
                (a.className = a.className.replace(s, " ")),
                  s.test(r.className) || (r.className += " line-numbers");
                var o,
                  u = e.code.match(t),
                  c = u ? u.length + 1 : 1,
                  d = new Array(c + 1).join("<span></span>");
                (o = document.createElement("span")).setAttribute(
                  "aria-hidden",
                  "true"
                ),
                  (o.className = "line-numbers-rows"),
                  (o.innerHTML = d),
                  r.hasAttribute("data-start") &&
                    (r.style.counterReset =
                      "linenumber " +
                      (parseInt(r.getAttribute("data-start"), 10) - 1)),
                  e.element.appendChild(o),
                  n(r),
                  Prism.hooks.run("line-numbers", e);
              }
            }
          }
        }),
        Prism.hooks.add("line-numbers", function (e) {
          (e.plugins = e.plugins || {}), (e.plugins.lineNumbers = !0);
        }),
        (Prism.plugins.lineNumbers = {
          getLine: function (t, n) {
            if ("PRE" === t.tagName && t.classList.contains(e)) {
              var a = t.querySelector(".line-numbers-rows"),
                r = parseInt(t.getAttribute("data-start"), 10) || 1,
                i = r + (a.children.length - 1);
              n < r && (n = r), i < n && (n = i);
              var s = n - r;
              return a.children[s];
            }
          },
        });
    }
  })();
