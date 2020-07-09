/* PrismJS 1.15.0
https://prismjs.com/download.html#themes=prism-okaidia&languages=markup+css+clike+javascript+markup-templating+php&plugins=line-highlight+line-numbers+toolbar+previewers+show-language+copy-to-clipboard */
var _self =
    "undefined" != typeof window
      ? window
      : "undefined" != typeof WorkerGlobalScope &&
        self instanceof WorkerGlobalScope
      ? self
      : {},
  Prism = (function (g) {
    var u = /\blang(?:uage)?-([\w-]+)\b/i,
      t = 0,
      C = {
        manual: g.Prism && g.Prism.manual,
        disableWorkerMessageHandler:
          g.Prism && g.Prism.disableWorkerMessageHandler,
        util: {
          encode: function (e) {
            return e instanceof M
              ? new M(e.type, C.util.encode(e.content), e.alias)
              : "Array" === C.util.type(e)
              ? e.map(C.util.encode)
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
              e.__id || Object.defineProperty(e, "__id", { value: ++t }), e.__id
            );
          },
          clone: function a(e, n) {
            var r,
              t,
              i = C.util.type(e);
            switch (((n = n || {}), i)) {
              case "Object":
                if (((t = C.util.objId(e)), n[t])) return n[t];
                for (var l in ((r = {}), (n[t] = r), e))
                  e.hasOwnProperty(l) && (r[l] = a(e[l], n));
                return r;
              case "Array":
                return (
                  (t = C.util.objId(e)),
                  n[t]
                    ? n[t]
                    : ((r = []),
                      (n[t] = r),
                      e.forEach(function (e, t) {
                        r[t] = a(e, n);
                      }),
                      r)
                );
              default:
                return e;
            }
          },
        },
        languages: {
          extend: function (e, t) {
            var a = C.util.clone(C.languages[e]);
            for (var n in t) a[n] = t[n];
            return a;
          },
          insertBefore: function (a, e, t, n) {
            var r = (n = n || C.languages)[a],
              i = {};
            for (var l in r)
              if (r.hasOwnProperty(l)) {
                if (l == e)
                  for (var o in t) t.hasOwnProperty(o) && (i[o] = t[o]);
                t.hasOwnProperty(l) || (i[l] = r[l]);
              }
            var s = n[a];
            return (
              (n[a] = i),
              C.languages.DFS(C.languages, function (e, t) {
                t === s && e != a && (this[e] = i);
              }),
              i
            );
          },
          DFS: function e(t, a, n, r) {
            r = r || {};
            var i = C.util.objId;
            for (var l in t)
              if (t.hasOwnProperty(l)) {
                a.call(t, l, t[l], n || l);
                var o = t[l],
                  s = C.util.type(o);
                "Object" !== s || r[i(o)]
                  ? "Array" !== s || r[i(o)] || ((r[i(o)] = !0), e(o, a, l, r))
                  : ((r[i(o)] = !0), e(o, a, null, r));
              }
          },
        },
        plugins: {},
        highlightAll: function (e, t) {
          C.highlightAllUnder(document, e, t);
        },
        highlightAllUnder: function (e, t, a) {
          var n = {
            callback: a,
            selector:
              'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
          };
          C.hooks.run("before-highlightall", n);
          for (
            var r, i = n.elements || e.querySelectorAll(n.selector), l = 0;
            (r = i[l++]);

          )
            C.highlightElement(r, !0 === t, n.callback);
        },
        highlightElement: function (e, t, a) {
          for (var n, r, i = e; i && !u.test(i.className); ) i = i.parentNode;
          i &&
            ((n = (i.className.match(u) || [, ""])[1].toLowerCase()),
            (r = C.languages[n])),
            (e.className =
              e.className.replace(u, "").replace(/\s+/g, " ") +
              " language-" +
              n),
            e.parentNode &&
              ((i = e.parentNode),
              /pre/i.test(i.nodeName) &&
                (i.className =
                  i.className.replace(u, "").replace(/\s+/g, " ") +
                  " language-" +
                  n));
          var l = { element: e, language: n, grammar: r, code: e.textContent },
            o = function (e) {
              (l.highlightedCode = e),
                C.hooks.run("before-insert", l),
                (l.element.innerHTML = l.highlightedCode),
                C.hooks.run("after-highlight", l),
                C.hooks.run("complete", l),
                a && a.call(l.element);
            };
          if ((C.hooks.run("before-sanity-check", l), l.code))
            if ((C.hooks.run("before-highlight", l), l.grammar))
              if (t && g.Worker) {
                var s = new Worker(C.filename);
                (s.onmessage = function (e) {
                  o(e.data);
                }),
                  s.postMessage(
                    JSON.stringify({
                      language: l.language,
                      code: l.code,
                      immediateClose: !0,
                    })
                  );
              } else o(C.highlight(l.code, l.grammar, l.language));
            else o(C.util.encode(l.code));
          else C.hooks.run("complete", l);
        },
        highlight: function (e, t, a) {
          var n = { code: e, grammar: t, language: a };
          return (
            C.hooks.run("before-tokenize", n),
            (n.tokens = C.tokenize(n.code, n.grammar)),
            C.hooks.run("after-tokenize", n),
            M.stringify(C.util.encode(n.tokens), n.language)
          );
        },
        matchGrammar: function (e, t, a, n, r, i, l) {
          for (var o in a)
            if (a.hasOwnProperty(o) && a[o]) {
              if (o == l) return;
              var s = a[o];
              s = "Array" === C.util.type(s) ? s : [s];
              for (var g = 0; g < s.length; ++g) {
                var u = s[g],
                  c = u.inside,
                  h = !!u.lookbehind,
                  f = !!u.greedy,
                  d = 0,
                  p = u.alias;
                if (f && !u.pattern.global) {
                  var m = u.pattern.toString().match(/[imuy]*$/)[0];
                  u.pattern = RegExp(u.pattern.source, m + "g");
                }
                u = u.pattern || u;
                for (var y = n, v = r; y < t.length; v += t[y].length, ++y) {
                  var k = t[y];
                  if (t.length > e.length) return;
                  if (!(k instanceof M)) {
                    if (f && y != t.length - 1) {
                      if (((u.lastIndex = v), !(x = u.exec(e)))) break;
                      for (
                        var b = x.index + (h ? x[1].length : 0),
                          w = x.index + x[0].length,
                          A = y,
                          P = v,
                          O = t.length;
                        A < O && (P < w || (!t[A].type && !t[A - 1].greedy));
                        ++A
                      )
                        (P += t[A].length) <= b && (++y, (v = P));
                      if (t[y] instanceof M) continue;
                      (N = A - y), (k = e.slice(v, P)), (x.index -= v);
                    } else {
                      u.lastIndex = 0;
                      var x = u.exec(k),
                        N = 1;
                    }
                    if (x) {
                      h && (d = x[1] ? x[1].length : 0);
                      w = (b = x.index + d) + (x = x[0].slice(d)).length;
                      var j = k.slice(0, b),
                        S = k.slice(w),
                        E = [y, N];
                      j && (++y, (v += j.length), E.push(j));
                      var _ = new M(o, c ? C.tokenize(x, c) : x, p, x, f);
                      if (
                        (E.push(_),
                        S && E.push(S),
                        Array.prototype.splice.apply(t, E),
                        1 != N && C.matchGrammar(e, t, a, y, v, !0, o),
                        i)
                      )
                        break;
                    } else if (i) break;
                  }
                }
              }
            }
        },
        tokenize: function (e, t) {
          var a = [e],
            n = t.rest;
          if (n) {
            for (var r in n) t[r] = n[r];
            delete t.rest;
          }
          return C.matchGrammar(e, a, t, 0, 0, !1), a;
        },
        hooks: {
          all: {},
          add: function (e, t) {
            var a = C.hooks.all;
            (a[e] = a[e] || []), a[e].push(t);
          },
          run: function (e, t) {
            var a = C.hooks.all[e];
            if (a && a.length) for (var n, r = 0; (n = a[r++]); ) n(t);
          },
        },
        Token: M,
      };
    function M(e, t, a, n, r) {
      (this.type = e),
        (this.content = t),
        (this.alias = a),
        (this.length = 0 | (n || "").length),
        (this.greedy = !!r);
    }
    if (
      ((g.Prism = C),
      (M.stringify = function (t, a, e) {
        if ("string" == typeof t) return t;
        if ("Array" === C.util.type(t))
          return t
            .map(function (e) {
              return M.stringify(e, a, t);
            })
            .join("");
        var n = {
          type: t.type,
          content: M.stringify(t.content, a, e),
          tag: "span",
          classes: ["token", t.type],
          attributes: {},
          language: a,
          parent: e,
        };
        if (t.alias) {
          var r = "Array" === C.util.type(t.alias) ? t.alias : [t.alias];
          Array.prototype.push.apply(n.classes, r);
        }
        C.hooks.run("wrap", n);
        var i = Object.keys(n.attributes)
          .map(function (e) {
            return (
              e + '="' + (n.attributes[e] || "").replace(/"/g, "&quot;") + '"'
            );
          })
          .join(" ");
        return (
          "<" +
          n.tag +
          ' class="' +
          n.classes.join(" ") +
          '"' +
          (i ? " " + i : "") +
          ">" +
          n.content +
          "</" +
          n.tag +
          ">"
        );
      }),
      !g.document)
    )
      return (
        g.addEventListener &&
          (C.disableWorkerMessageHandler ||
            g.addEventListener(
              "message",
              function (e) {
                var t = JSON.parse(e.data),
                  a = t.language,
                  n = t.code,
                  r = t.immediateClose;
                g.postMessage(C.highlight(n, C.languages[a], a)),
                  r && g.close();
              },
              !1
            )),
        C
      );
    var e =
      document.currentScript ||
      [].slice.call(document.getElementsByTagName("script")).pop();
    return (
      e &&
        ((C.filename = e.src),
        C.manual ||
          e.hasAttribute("data-manual") ||
          ("loading" !== document.readyState
            ? window.requestAnimationFrame
              ? window.requestAnimationFrame(C.highlightAll)
              : window.setTimeout(C.highlightAll, 16)
            : document.addEventListener("DOMContentLoaded", C.highlightAll))),
      C
    );
  })(_self);
"undefined" != typeof module && module.exports && (module.exports = Prism),
  "undefined" != typeof global && (global.Prism = Prism);
(Prism.languages.markup = {
  comment: /<!--[\s\S]*?-->/,
  prolog: /<\?[\s\S]+?\?>/,
  doctype: /<!DOCTYPE[\s\S]+?>/i,
  cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
  tag: {
    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/i,
    greedy: !0,
    inside: {
      tag: {
        pattern: /^<\/?[^\s>\/]+/i,
        inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ },
      },
      "attr-value": {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
        inside: {
          punctuation: [/^=/, { pattern: /^(\s*)["']|["']$/, lookbehind: !0 }],
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
  Prism.hooks.add("wrap", function (a) {
    "entity" === a.type &&
      (a.attributes.title = a.content.replace(/&amp;/, "&"));
  }),
  Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
    value: function (a, e) {
      var s = {};
      (s["language-" + e] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: !0,
        inside: Prism.languages[e],
      }),
        (s.cdata = /^<!\[CDATA\[|\]\]>$/i);
      var n = {
        "included-cdata": { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, inside: s },
      };
      n["language-" + e] = { pattern: /[\s\S]+/, inside: Prism.languages[e] };
      var i = {};
      (i[a] = {
        pattern: RegExp(
          "(<__[\\s\\S]*?>)(?:<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\s*|[\\s\\S])*?(?=<\\/__>)".replace(
            /__/g,
            a
          ),
          "i"
        ),
        lookbehind: !0,
        greedy: !0,
        inside: n,
      }),
        Prism.languages.insertBefore("markup", "cdata", i);
    },
  }),
  (Prism.languages.xml = Prism.languages.extend("markup", {})),
  (Prism.languages.html = Prism.languages.markup),
  (Prism.languages.mathml = Prism.languages.markup),
  (Prism.languages.svg = Prism.languages.markup);
!(function (s) {
  var e = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
  (s.languages.css = {
    comment: /\/\*[\s\S]*?\*\//,
    atrule: {
      pattern: /@[\w-]+?[\s\S]*?(?:;|(?=\s*\{))/i,
      inside: { rule: /@[\w-]+/ },
    },
    url: RegExp("url\\((?:" + e.source + "|.*?)\\)", "i"),
    selector: RegExp("[^{}\\s](?:[^{};\"']|" + e.source + ")*?(?=\\s*\\{)"),
    string: { pattern: e, greedy: !0 },
    property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
    important: /!important\b/i,
    function: /[-a-z0-9]+(?=\()/i,
    punctuation: /[(){};:,]/,
  }),
    (s.languages.css.atrule.inside.rest = s.languages.css);
  var a = s.languages.markup;
  a &&
    (a.tag.addInlined("style", "css"),
    s.languages.insertBefore(
      "inside",
      "attr-value",
      {
        "style-attr": {
          pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
          inside: {
            "attr-name": { pattern: /^\s*style/i, inside: a.tag.inside },
            punctuation: /^\s*=\s*['"]|['"]\s*$/,
            "attr-value": { pattern: /.+/i, inside: s.languages.css },
          },
          alias: "language-css",
        },
      },
      a.tag
    ));
})(Prism);
Prism.languages.clike = {
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
};
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
      pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})\]]))/,
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
  (Prism.languages.js = Prism.languages.javascript);
!(function (h) {
  function v(e, n) {
    return "___" + e.toUpperCase() + n + "___";
  }
  Object.defineProperties((h.languages["markup-templating"] = {}), {
    buildPlaceholders: {
      value: function (a, r, e, o) {
        if (a.language === r) {
          var c = (a.tokenStack = []);
          (a.code = a.code.replace(e, function (e) {
            if ("function" == typeof o && !o(e)) return e;
            for (var n, t = c.length; -1 !== a.code.indexOf((n = v(r, t))); )
              ++t;
            return (c[t] = e), n;
          })),
            (a.grammar = h.languages.markup);
        }
      },
    },
    tokenizePlaceholders: {
      value: function (p, k) {
        if (p.language === k && p.tokenStack) {
          p.grammar = h.languages[k];
          var m = 0,
            d = Object.keys(p.tokenStack);
          !(function e(n) {
            for (var t = 0; t < n.length && !(m >= d.length); t++) {
              var a = n[t];
              if (
                "string" == typeof a ||
                (a.content && "string" == typeof a.content)
              ) {
                var r = d[m],
                  o = p.tokenStack[r],
                  c = "string" == typeof a ? a : a.content,
                  i = v(k, r),
                  u = c.indexOf(i);
                if (-1 < u) {
                  ++m;
                  var g = c.substring(0, u),
                    l = new h.Token(
                      k,
                      h.tokenize(o, p.grammar),
                      "language-" + k,
                      o
                    ),
                    s = c.substring(u + i.length),
                    f = [];
                  g && f.push.apply(f, e([g])),
                    f.push(l),
                    s && f.push.apply(f, e([s])),
                    "string" == typeof a
                      ? n.splice.apply(n, [t, 1].concat(f))
                      : (a.content = f);
                }
              } else a.content && e(a.content);
            }
            return n;
          })(p.tokens);
        }
      },
    },
  });
})(Prism);
!(function (n) {
  (n.languages.php = n.languages.extend("clike", {
    keyword: /\b(?:__halt_compiler|abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|finally|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|new|or|parent|print|private|protected|public|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|yield)\b/i,
    boolean: { pattern: /\b(?:false|true)\b/i, alias: "constant" },
    constant: [/\b[A-Z_][A-Z0-9_]*\b/, /\b(?:null)\b/i],
    comment: {
      pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
      lookbehind: !0,
    },
  })),
    n.languages.insertBefore("php", "string", {
      "shell-comment": {
        pattern: /(^|[^\\])#.*/,
        lookbehind: !0,
        alias: "comment",
      },
    }),
    n.languages.insertBefore("php", "comment", {
      delimiter: { pattern: /\?>$|^<\?(?:php(?=\s)|=)?/i, alias: "important" },
    }),
    n.languages.insertBefore("php", "keyword", {
      variable: /\$+(?:\w+\b|(?={))/i,
      package: {
        pattern: /(\\|namespace\s+|use\s+)[\w\\]+/,
        lookbehind: !0,
        inside: { punctuation: /\\/ },
      },
    }),
    n.languages.insertBefore("php", "operator", {
      property: { pattern: /(->)[\w]+/, lookbehind: !0 },
    });
  var e = {
    pattern: /{\$(?:{(?:{[^{}]+}|[^{}]+)}|[^{}])+}|(^|[^\\{])\$+(?:\w+(?:\[.+?]|->\w+)*)/,
    lookbehind: !0,
    inside: { rest: n.languages.php },
  };
  n.languages.insertBefore("php", "string", {
    "nowdoc-string": {
      pattern: /<<<'([^']+)'(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\1;/,
      greedy: !0,
      alias: "string",
      inside: {
        delimiter: {
          pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
          alias: "symbol",
          inside: { punctuation: /^<<<'?|[';]$/ },
        },
      },
    },
    "heredoc-string": {
      pattern: /<<<(?:"([^"]+)"(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\1;|([a-z_]\w*)(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\2;)/i,
      greedy: !0,
      alias: "string",
      inside: {
        delimiter: {
          pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
          alias: "symbol",
          inside: { punctuation: /^<<<"?|[";]$/ },
        },
        interpolation: e,
      },
    },
    "single-quoted-string": {
      pattern: /'(?:\\[\s\S]|[^\\'])*'/,
      greedy: !0,
      alias: "string",
    },
    "double-quoted-string": {
      pattern: /"(?:\\[\s\S]|[^\\"])*"/,
      greedy: !0,
      alias: "string",
      inside: { interpolation: e },
    },
  }),
    delete n.languages.php.string,
    n.hooks.add("before-tokenize", function (e) {
      if (/<\?/.test(e.code)) {
        n.languages["markup-templating"].buildPlaceholders(
          e,
          "php",
          /<\?(?:[^"'/#]|\/(?![*/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|(?:\/\/|#)(?:[^?\n\r]|\?(?!>))*|\/\*[\s\S]*?(?:\*\/|$))*?(?:\?>|$)/gi
        );
      }
    }),
    n.hooks.add("after-tokenize", function (e) {
      n.languages["markup-templating"].tokenizePlaceholders(e, "php");
    });
})(Prism);
!(function () {
  if (
    "undefined" != typeof self &&
    self.Prism &&
    self.document &&
    document.querySelector
  ) {
    var t,
      h = function () {
        if (void 0 === t) {
          var e = document.createElement("div");
          (e.style.fontSize = "13px"),
            (e.style.lineHeight = "1.5"),
            (e.style.padding = 0),
            (e.style.border = 0),
            (e.innerHTML = "&nbsp;<br />&nbsp;"),
            document.body.appendChild(e),
            (t = 38 === e.offsetHeight),
            document.body.removeChild(e);
        }
        return t;
      },
      l = 0;
    Prism.hooks.add("before-sanity-check", function (e) {
      var t = e.element.parentNode,
        n = t && t.getAttribute("data-line");
      if (t && n && /pre/i.test(t.nodeName)) {
        var i = 0;
        r(".line-highlight", t).forEach(function (e) {
          (i += e.textContent.length), e.parentNode.removeChild(e);
        }),
          i &&
            /^( \n)+$/.test(e.code.slice(-i)) &&
            (e.code = e.code.slice(0, -i));
      }
    }),
      Prism.hooks.add("complete", function e(t) {
        var n = t.element.parentNode,
          i = n && n.getAttribute("data-line");
        if (n && i && /pre/i.test(n.nodeName)) {
          clearTimeout(l);
          var r = Prism.plugins.lineNumbers,
            o = t.plugins && t.plugins.lineNumbers;
          g(n, "line-numbers") && r && !o
            ? Prism.hooks.add("line-numbers", e)
            : (a(n, i), (l = setTimeout(s, 1)));
        }
      }),
      window.addEventListener("hashchange", s),
      window.addEventListener("resize", function () {
        var e = document.querySelectorAll("pre[data-line]");
        Array.prototype.forEach.call(e, function (e) {
          a(e);
        });
      });
  }
  function r(e, t) {
    return Array.prototype.slice.call((t || document).querySelectorAll(e));
  }
  function g(e, t) {
    return (
      (t = " " + t + " "),
      -1 < (" " + e.className + " ").replace(/[\n\t]/g, " ").indexOf(t)
    );
  }
  function a(e, t, n) {
    for (
      var i,
        r = (t = "string" == typeof t ? t : e.getAttribute("data-line"))
          .replace(/\s+/g, "")
          .split(","),
        o = +e.getAttribute("data-line-offset") || 0,
        l = (h() ? parseInt : parseFloat)(getComputedStyle(e).lineHeight),
        a = g(e, "line-numbers"),
        s = 0;
      (i = r[s++]);

    ) {
      var d = i.split("-"),
        u = +d[0],
        c = +d[1] || u,
        m =
          e.querySelector('.line-highlight[data-range="' + i + '"]') ||
          document.createElement("div");
      if (
        (m.setAttribute("aria-hidden", "true"),
        m.setAttribute("data-range", i),
        (m.className = (n || "") + " line-highlight"),
        a && Prism.plugins.lineNumbers)
      ) {
        var p = Prism.plugins.lineNumbers.getLine(e, u),
          f = Prism.plugins.lineNumbers.getLine(e, c);
        p && (m.style.top = p.offsetTop + "px"),
          f &&
            (m.style.height =
              f.offsetTop - p.offsetTop + f.offsetHeight + "px");
      } else
        m.setAttribute("data-start", u),
          u < c && m.setAttribute("data-end", c),
          (m.style.top = (u - o - 1) * l + "px"),
          (m.textContent = new Array(c - u + 2).join(" \n"));
      a ? e.appendChild(m) : (e.querySelector("code") || e).appendChild(m);
    }
  }
  function s() {
    var e = location.hash.slice(1);
    r(".temporary.line-highlight").forEach(function (e) {
      e.parentNode.removeChild(e);
    });
    var t = (e.match(/\.([\d,-]+)$/) || [, ""])[1];
    if (t && !document.getElementById(e)) {
      var n = e.slice(0, e.lastIndexOf(".")),
        i = document.getElementById(n);
      i &&
        (i.hasAttribute("data-line") || i.setAttribute("data-line", ""),
        a(i, t, "temporary "),
        document.querySelector(".temporary.line-highlight").scrollIntoView());
    }
  }
})();
!(function () {
  if ("undefined" != typeof self && self.Prism && self.document) {
    var l = "line-numbers",
      c = /\n(?!$)/g,
      m = function (e) {
        var t = a(e)["white-space"];
        if ("pre-wrap" === t || "pre-line" === t) {
          var n = e.querySelector("code"),
            r = e.querySelector(".line-numbers-rows"),
            s = e.querySelector(".line-numbers-sizer"),
            i = n.textContent.split(c);
          s ||
            (((s = document.createElement("span")).className =
              "line-numbers-sizer"),
            n.appendChild(s)),
            (s.style.display = "block"),
            i.forEach(function (e, t) {
              s.textContent = e || "\n";
              var n = s.getBoundingClientRect().height;
              r.children[t].style.height = n + "px";
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
      Array.prototype.forEach.call(document.querySelectorAll("pre." + l), m);
    }),
      Prism.hooks.add("complete", function (e) {
        if (e.code) {
          var t = e.element,
            n = t.parentNode;
          if (
            n &&
            /pre/i.test(n.nodeName) &&
            !t.querySelector(".line-numbers-rows")
          ) {
            for (
              var r = !1, s = /(?:^|\s)line-numbers(?:\s|$)/, i = t;
              i;
              i = i.parentNode
            )
              if (s.test(i.className)) {
                r = !0;
                break;
              }
            if (r) {
              (t.className = t.className.replace(s, " ")),
                s.test(n.className) || (n.className += " line-numbers");
              var l,
                a = e.code.match(c),
                o = a ? a.length + 1 : 1,
                u = new Array(o + 1).join("<span></span>");
              (l = document.createElement("span")).setAttribute(
                "aria-hidden",
                "true"
              ),
                (l.className = "line-numbers-rows"),
                (l.innerHTML = u),
                n.hasAttribute("data-start") &&
                  (n.style.counterReset =
                    "linenumber " +
                    (parseInt(n.getAttribute("data-start"), 10) - 1)),
                e.element.appendChild(l),
                m(n),
                Prism.hooks.run("line-numbers", e);
            }
          }
        }
      }),
      Prism.hooks.add("line-numbers", function (e) {
        (e.plugins = e.plugins || {}), (e.plugins.lineNumbers = !0);
      }),
      (Prism.plugins.lineNumbers = {
        getLine: function (e, t) {
          if ("PRE" === e.tagName && e.classList.contains(l)) {
            var n = e.querySelector(".line-numbers-rows"),
              r = parseInt(e.getAttribute("data-start"), 10) || 1,
              s = r + (n.children.length - 1);
            t < r && (t = r), s < t && (t = s);
            var i = t - r;
            return n.children[i];
          }
        },
      });
  }
})();
!(function () {
  if ("undefined" != typeof self && self.Prism && self.document) {
    var r = [],
      i = {},
      n = function () {};
    Prism.plugins.toolbar = {};
    var t = (Prism.plugins.toolbar.registerButton = function (t, n) {
        var e;
        (e =
          "function" == typeof n
            ? n
            : function (t) {
                var e;
                return (
                  "function" == typeof n.onClick
                    ? (((e = document.createElement("button")).type = "button"),
                      e.addEventListener("click", function () {
                        n.onClick.call(this, t);
                      }))
                    : "string" == typeof n.url
                    ? ((e = document.createElement("a")).href = n.url)
                    : (e = document.createElement("span")),
                  (e.textContent = n.text),
                  e
                );
              }),
          r.push((i[t] = e));
      }),
      e = (Prism.plugins.toolbar.hook = function (a) {
        var t = a.element.parentNode;
        if (
          t &&
          /pre/i.test(t.nodeName) &&
          !t.parentNode.classList.contains("code-toolbar")
        ) {
          var e = document.createElement("div");
          e.classList.add("code-toolbar"),
            t.parentNode.insertBefore(e, t),
            e.appendChild(t);
          var o = document.createElement("div");
          o.classList.add("toolbar"),
            document.body.hasAttribute("data-toolbar-order") &&
              (r = document.body
                .getAttribute("data-toolbar-order")
                .split(",")
                .map(function (t) {
                  return i[t] || n;
                })),
            r.forEach(function (t) {
              var e = t(a);
              if (e) {
                var n = document.createElement("div");
                n.classList.add("toolbar-item"),
                  n.appendChild(e),
                  o.appendChild(n);
              }
            }),
            e.appendChild(o);
        }
      });
    t("label", function (t) {
      var e = t.element.parentNode;
      if (e && /pre/i.test(e.nodeName) && e.hasAttribute("data-label")) {
        var n,
          a,
          o = e.getAttribute("data-label");
        try {
          a = document.querySelector("template#" + o);
        } catch (t) {}
        return (
          a
            ? (n = a.content)
            : (e.hasAttribute("data-url")
                ? ((n = document.createElement("a")).href = e.getAttribute(
                    "data-url"
                  ))
                : (n = document.createElement("span")),
              (n.textContent = o)),
          n
        );
      }
    }),
      Prism.hooks.add("complete", e);
  }
})();
!(function () {
  if (
    ("undefined" == typeof self || self.Prism) &&
    self.document &&
    Function.prototype.bind
  ) {
    var u,
      s,
      o = {
        gradient: {
          create:
            ((u = {}),
            (s = function (e) {
              if (u[e]) return u[e];
              var s,
                i,
                t,
                a,
                r = e.match(
                  /^(\b|\B-[a-z]{1,10}-)((?:repeating-)?(?:linear|radial)-gradient)/
                ),
                n = r && r[1],
                l = r && r[2],
                o = e
                  .replace(
                    /^(?:\b|\B-[a-z]{1,10}-)(?:repeating-)?(?:linear|radial)-gradient\(|\)$/g,
                    ""
                  )
                  .split(/\s*,\s*/);
              return 0 <= l.indexOf("linear")
                ? (u[e] =
                    ((s = n),
                    (i = l),
                    (a = "180deg"),
                    /^(?:-?\d*\.?\d+(?:deg|rad)|to\b|top|right|bottom|left)/.test(
                      (t = o)[0]
                    ) &&
                      (a = t.shift()).indexOf("to ") < 0 &&
                      (0 <= a.indexOf("top")
                        ? (a =
                            0 <= a.indexOf("left")
                              ? "to bottom right"
                              : 0 <= a.indexOf("right")
                              ? "to bottom left"
                              : "to bottom")
                        : 0 <= a.indexOf("bottom")
                        ? (a =
                            0 <= a.indexOf("left")
                              ? "to top right"
                              : 0 <= a.indexOf("right")
                              ? "to top left"
                              : "to top")
                        : 0 <= a.indexOf("left")
                        ? (a = "to right")
                        : 0 <= a.indexOf("right")
                        ? (a = "to left")
                        : s &&
                          (0 <= a.indexOf("deg")
                            ? (a = 90 - parseFloat(a) + "deg")
                            : 0 <= a.indexOf("rad") &&
                              (a = Math.PI / 2 - parseFloat(a) + "rad"))),
                    i + "(" + a + "," + t.join(",") + ")"))
                : 0 <= l.indexOf("radial")
                ? (u[e] = (function (e, s, i) {
                    if (i[0].indexOf("at") < 0) {
                      var t = "center",
                        a = "ellipse",
                        r = "farthest-corner";
                      if (
                        (/\bcenter|top|right|bottom|left\b|^\d+/.test(i[0]) &&
                          (t = i.shift().replace(/\s*-?\d+(?:rad|deg)\s*/, "")),
                        /\bcircle|ellipse|closest|farthest|contain|cover\b/.test(
                          i[0]
                        ))
                      ) {
                        var n = i.shift().split(/\s+/);
                        !n[0] ||
                          ("circle" !== n[0] && "ellipse" !== n[0]) ||
                          (a = n.shift()),
                          n[0] && (r = n.shift()),
                          "cover" === r
                            ? (r = "farthest-corner")
                            : "contain" === r && (r = "clothest-side");
                      }
                      return (
                        s +
                        "(" +
                        a +
                        " " +
                        r +
                        " at " +
                        t +
                        "," +
                        i.join(",") +
                        ")"
                      );
                    }
                    return s + "(" + i.join(",") + ")";
                  })(0, l, o))
                : (u[e] = l + "(" + o.join(",") + ")");
            }),
            function () {
              new Prism.plugins.Previewer(
                "gradient",
                function (e) {
                  return (
                    (this.firstChild.style.backgroundImage = ""),
                    (this.firstChild.style.backgroundImage = s(e)),
                    !!this.firstChild.style.backgroundImage
                  );
                },
                "*",
                function () {
                  this._elt.innerHTML = "<div></div>";
                }
              );
            }),
          tokens: {
            gradient: {
              pattern: /(?:\b|\B-[a-z]{1,10}-)(?:repeating-)?(?:linear|radial)-gradient\((?:(?:rgb|hsl)a?\(.+?\)|[^\)])+\)/gi,
              inside: { function: /[\w-]+(?=\()/, punctuation: /[(),]/ },
            },
          },
          languages: {
            css: !0,
            less: !0,
            sass: [
              {
                lang: "sass",
                before: "punctuation",
                inside: "inside",
                root:
                  Prism.languages.sass && Prism.languages.sass["variable-line"],
              },
              {
                lang: "sass",
                before: "punctuation",
                inside: "inside",
                root:
                  Prism.languages.sass && Prism.languages.sass["property-line"],
              },
            ],
            scss: !0,
            stylus: [
              {
                lang: "stylus",
                before: "func",
                inside: "rest",
                root:
                  Prism.languages.stylus &&
                  Prism.languages.stylus["property-declaration"].inside,
              },
              {
                lang: "stylus",
                before: "func",
                inside: "rest",
                root:
                  Prism.languages.stylus &&
                  Prism.languages.stylus["variable-declaration"].inside,
              },
            ],
          },
        },
        angle: {
          create: function () {
            new Prism.plugins.Previewer(
              "angle",
              function (e) {
                var s,
                  i,
                  t = parseFloat(e),
                  a = e.match(/[a-z]+$/i);
                if (!t || !a) return !1;
                switch ((a = a[0])) {
                  case "deg":
                    s = 360;
                    break;
                  case "grad":
                    s = 400;
                    break;
                  case "rad":
                    s = 2 * Math.PI;
                    break;
                  case "turn":
                    s = 1;
                }
                return (
                  (i = (100 * t) / s),
                  (i %= 100),
                  this[(t < 0 ? "set" : "remove") + "Attribute"](
                    "data-negative",
                    ""
                  ),
                  (this.querySelector("circle").style.strokeDasharray =
                    Math.abs(i) + ",500"),
                  !0
                );
              },
              "*",
              function () {
                this._elt.innerHTML =
                  '<svg viewBox="0 0 64 64"><circle r="16" cy="32" cx="32"></circle></svg>';
              }
            );
          },
          tokens: {
            angle: /(?:\b|\B-|(?=\B\.))\d*\.?\d+(?:deg|g?rad|turn)\b/i,
          },
          languages: {
            css: !0,
            less: !0,
            markup: {
              lang: "markup",
              before: "punctuation",
              inside: "inside",
              root:
                Prism.languages.markup &&
                Prism.languages.markup.tag.inside["attr-value"],
            },
            sass: [
              {
                lang: "sass",
                inside: "inside",
                root:
                  Prism.languages.sass && Prism.languages.sass["property-line"],
              },
              {
                lang: "sass",
                before: "operator",
                inside: "inside",
                root:
                  Prism.languages.sass && Prism.languages.sass["variable-line"],
              },
            ],
            scss: !0,
            stylus: [
              {
                lang: "stylus",
                before: "func",
                inside: "rest",
                root:
                  Prism.languages.stylus &&
                  Prism.languages.stylus["property-declaration"].inside,
              },
              {
                lang: "stylus",
                before: "func",
                inside: "rest",
                root:
                  Prism.languages.stylus &&
                  Prism.languages.stylus["variable-declaration"].inside,
              },
            ],
          },
        },
        color: {
          create: function () {
            new Prism.plugins.Previewer("color", function (e) {
              return (
                (this.style.backgroundColor = ""),
                (this.style.backgroundColor = e),
                !!this.style.backgroundColor
              );
            });
          },
          tokens: {
            color: {
              pattern: /\B#(?:[0-9a-f]{3}){1,2}\b|\b(?:rgb|hsl)\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)\B|\b(?:rgb|hsl)a\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*(?:0|0?\.\d+|1)\s*\)\B|\b(?:AliceBlue|AntiqueWhite|Aqua|Aquamarine|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue|BlueViolet|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|DarkBlue|DarkCyan|DarkGoldenRod|DarkGray|DarkGreen|DarkKhaki|DarkMagenta|DarkOliveGreen|DarkOrange|DarkOrchid|DarkRed|DarkSalmon|DarkSeaGreen|DarkSlateBlue|DarkSlateGray|DarkTurquoise|DarkViolet|DeepPink|DeepSkyBlue|DimGray|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold|GoldenRod|Gray|Green|GreenYellow|HoneyDew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender|LavenderBlush|LawnGreen|LemonChiffon|LightBlue|LightCoral|LightCyan|LightGoldenRodYellow|LightGray|LightGreen|LightPink|LightSalmon|LightSeaGreen|LightSkyBlue|LightSlateGray|LightSteelBlue|LightYellow|Lime|LimeGreen|Linen|Magenta|Maroon|MediumAquaMarine|MediumBlue|MediumOrchid|MediumPurple|MediumSeaGreen|MediumSlateBlue|MediumSpringGreen|MediumTurquoise|MediumVioletRed|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive|OliveDrab|Orange|OrangeRed|Orchid|PaleGoldenRod|PaleGreen|PaleTurquoise|PaleVioletRed|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|SeaShell|Sienna|Silver|SkyBlue|SlateBlue|SlateGray|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Turquoise|Violet|Wheat|White|WhiteSmoke|Yellow|YellowGreen)\b/i,
              inside: { function: /[\w-]+(?=\()/, punctuation: /[(),]/ },
            },
          },
          languages: {
            css: !0,
            less: !0,
            markup: {
              lang: "markup",
              before: "punctuation",
              inside: "inside",
              root:
                Prism.languages.markup &&
                Prism.languages.markup.tag.inside["attr-value"],
            },
            sass: [
              {
                lang: "sass",
                before: "punctuation",
                inside: "inside",
                root:
                  Prism.languages.sass && Prism.languages.sass["variable-line"],
              },
              {
                lang: "sass",
                inside: "inside",
                root:
                  Prism.languages.sass && Prism.languages.sass["property-line"],
              },
            ],
            scss: !0,
            stylus: [
              {
                lang: "stylus",
                before: "hexcode",
                inside: "rest",
                root:
                  Prism.languages.stylus &&
                  Prism.languages.stylus["property-declaration"].inside,
              },
              {
                lang: "stylus",
                before: "hexcode",
                inside: "rest",
                root:
                  Prism.languages.stylus &&
                  Prism.languages.stylus["variable-declaration"].inside,
              },
            ],
          },
        },
        easing: {
          create: function () {
            new Prism.plugins.Previewer(
              "easing",
              function (e) {
                var s = (e =
                  {
                    linear: "0,0,1,1",
                    ease: ".25,.1,.25,1",
                    "ease-in": ".42,0,1,1",
                    "ease-out": "0,0,.58,1",
                    "ease-in-out": ".42,0,.58,1",
                  }[e] || e).match(/-?\d*\.?\d+/g);
                if (4 !== s.length) return !1;
                (s = s.map(function (e, s) {
                  return 100 * (s % 2 ? 1 - e : e);
                })),
                  this.querySelector("path").setAttribute(
                    "d",
                    "M0,100 C" +
                      s[0] +
                      "," +
                      s[1] +
                      ", " +
                      s[2] +
                      "," +
                      s[3] +
                      ", 100,0"
                  );
                var i = this.querySelectorAll("line");
                return (
                  i[0].setAttribute("x2", s[0]),
                  i[0].setAttribute("y2", s[1]),
                  i[1].setAttribute("x2", s[2]),
                  i[1].setAttribute("y2", s[3]),
                  !0
                );
              },
              "*",
              function () {
                this._elt.innerHTML =
                  '<svg viewBox="-20 -20 140 140" width="100" height="100"><defs><marker id="prism-previewer-easing-marker" viewBox="0 0 4 4" refX="2" refY="2" markerUnits="strokeWidth"><circle cx="2" cy="2" r="1.5" /></marker></defs><path d="M0,100 C20,50, 40,30, 100,0" /><line x1="0" y1="100" x2="20" y2="50" marker-start="url(' +
                  location.href +
                  '#prism-previewer-easing-marker)" marker-end="url(' +
                  location.href +
                  '#prism-previewer-easing-marker)" /><line x1="100" y1="0" x2="40" y2="30" marker-start="url(' +
                  location.href +
                  '#prism-previewer-easing-marker)" marker-end="url(' +
                  location.href +
                  '#prism-previewer-easing-marker)" /></svg>';
              }
            );
          },
          tokens: {
            easing: {
              pattern: /\bcubic-bezier\((?:-?\d*\.?\d+,\s*){3}-?\d*\.?\d+\)\B|\b(?:linear|ease(?:-in)?(?:-out)?)(?=\s|[;}]|$)/i,
              inside: { function: /[\w-]+(?=\()/, punctuation: /[(),]/ },
            },
          },
          languages: {
            css: !0,
            less: !0,
            sass: [
              {
                lang: "sass",
                inside: "inside",
                before: "punctuation",
                root:
                  Prism.languages.sass && Prism.languages.sass["variable-line"],
              },
              {
                lang: "sass",
                inside: "inside",
                root:
                  Prism.languages.sass && Prism.languages.sass["property-line"],
              },
            ],
            scss: !0,
            stylus: [
              {
                lang: "stylus",
                before: "hexcode",
                inside: "rest",
                root:
                  Prism.languages.stylus &&
                  Prism.languages.stylus["property-declaration"].inside,
              },
              {
                lang: "stylus",
                before: "hexcode",
                inside: "rest",
                root:
                  Prism.languages.stylus &&
                  Prism.languages.stylus["variable-declaration"].inside,
              },
            ],
          },
        },
        time: {
          create: function () {
            new Prism.plugins.Previewer(
              "time",
              function (e) {
                var s = parseFloat(e),
                  i = e.match(/[a-z]+$/i);
                return (
                  !(!s || !i) &&
                  ((i = i[0]),
                  (this.querySelector("circle").style.animationDuration =
                    2 * s + i),
                  !0)
                );
              },
              "*",
              function () {
                this._elt.innerHTML =
                  '<svg viewBox="0 0 64 64"><circle r="16" cy="32" cx="32"></circle></svg>';
              }
            );
          },
          tokens: { time: /(?:\b|\B-|(?=\B\.))\d*\.?\d+m?s\b/i },
          languages: {
            css: !0,
            less: !0,
            markup: {
              lang: "markup",
              before: "punctuation",
              inside: "inside",
              root:
                Prism.languages.markup &&
                Prism.languages.markup.tag.inside["attr-value"],
            },
            sass: [
              {
                lang: "sass",
                inside: "inside",
                root:
                  Prism.languages.sass && Prism.languages.sass["property-line"],
              },
              {
                lang: "sass",
                before: "operator",
                inside: "inside",
                root:
                  Prism.languages.sass && Prism.languages.sass["variable-line"],
              },
            ],
            scss: !0,
            stylus: [
              {
                lang: "stylus",
                before: "hexcode",
                inside: "rest",
                root:
                  Prism.languages.stylus &&
                  Prism.languages.stylus["property-declaration"].inside,
              },
              {
                lang: "stylus",
                before: "hexcode",
                inside: "rest",
                root:
                  Prism.languages.stylus &&
                  Prism.languages.stylus["variable-declaration"].inside,
              },
            ],
          },
        },
      },
      i = /(?:^|\s)token(?=$|\s)/,
      e = /(?:^|\s)active(?=$|\s)/g,
      n = /(?:^|\s)flipped(?=$|\s)/g,
      r = function (e, s, i, t) {
        (this._elt = null),
          (this._type = e),
          (this._clsRegexp = RegExp("(?:^|\\s)" + e + "(?=$|\\s)")),
          (this._token = null),
          (this.updater = s),
          (this._mouseout = this.mouseout.bind(this)),
          (this.initializer = t);
        var a = this;
        i || (i = ["*"]),
          Array.isArray(i) || (i = [i]),
          i.forEach(function (e) {
            "string" != typeof e && (e = e.lang),
              r.byLanguages[e] || (r.byLanguages[e] = []),
              r.byLanguages[e].indexOf(a) < 0 && r.byLanguages[e].push(a);
          }),
          (r.byType[e] = this);
      };
    for (var t in ((r.prototype.init = function () {
      this._elt ||
        ((this._elt = document.createElement("div")),
        (this._elt.className = "prism-previewer prism-previewer-" + this._type),
        document.body.appendChild(this._elt),
        this.initializer && this.initializer());
    }),
    (r.prototype.isDisabled = function (e) {
      do {
        if (e.hasAttribute && e.hasAttribute("data-previewers"))
          return (
            -1 ===
            (e.getAttribute("data-previewers") || "")
              .split(/\s+/)
              .indexOf(this._type)
          );
      } while ((e = e.parentNode));
      return !1;
    }),
    (r.prototype.check = function (e) {
      if (!i.test(e.className) || !this.isDisabled(e)) {
        do {
          if (i.test(e.className) && this._clsRegexp.test(e.className)) break;
        } while ((e = e.parentNode));
        e && e !== this._token && ((this._token = e), this.show());
      }
    }),
    (r.prototype.mouseout = function () {
      this._token.removeEventListener("mouseout", this._mouseout, !1),
        (this._token = null),
        this.hide();
    }),
    (r.prototype.show = function () {
      var e, s, i, t, a;
      if ((this._elt || this.init(), this._token))
        if (this.updater.call(this._elt, this._token.textContent)) {
          this._token.addEventListener("mouseout", this._mouseout, !1);
          var r =
            ((e = this._token),
            (s = e.getBoundingClientRect()),
            (i = s.left),
            (t = s.top),
            (a = document.documentElement.getBoundingClientRect()),
            (i -= a.left),
            {
              top: (t -= a.top),
              right: innerWidth - i - s.width,
              bottom: innerHeight - t - s.height,
              left: i,
              width: s.width,
              height: s.height,
            });
          (this._elt.className += " active"),
            0 < r.top - this._elt.offsetHeight
              ? ((this._elt.className = this._elt.className.replace(n, "")),
                (this._elt.style.top = r.top + "px"),
                (this._elt.style.bottom = ""))
              : ((this._elt.className += " flipped"),
                (this._elt.style.bottom = r.bottom + "px"),
                (this._elt.style.top = "")),
            (this._elt.style.left = r.left + Math.min(200, r.width / 2) + "px");
        } else this.hide();
    }),
    (r.prototype.hide = function () {
      this._elt.className = this._elt.className.replace(e, "");
    }),
    (r.byLanguages = {}),
    (r.byType = {}),
    (r.initEvents = function (e, s) {
      var i = [];
      r.byLanguages[s] && (i = i.concat(r.byLanguages[s])),
        r.byLanguages["*"] && (i = i.concat(r.byLanguages["*"])),
        e.addEventListener(
          "mouseover",
          function (e) {
            var s = e.target;
            i.forEach(function (e) {
              e.check(s);
            });
          },
          !1
        );
    }),
    (Prism.plugins.Previewer = r),
    Prism.hooks.add("before-highlight", function (r) {
      for (var n in o) {
        var l = o[n].languages;
        if (r.language && l[r.language] && !l[r.language].initialized) {
          var e = l[r.language];
          Array.isArray(e) || (e = [e]),
            e.forEach(function (e) {
              var s, i, t, a;
              (e =
                (!0 === e
                  ? ((s = "important"), (i = r.language))
                  : ((s = e.before || "important"),
                    (i = e.inside || e.lang),
                    (t = e.root || Prism.languages),
                    (a = e.skip)),
                r.language)),
                !a &&
                  Prism.languages[e] &&
                  (Prism.languages.insertBefore(i, s, o[n].tokens, t),
                  (r.grammar = Prism.languages[e]),
                  (l[r.language] = { initialized: !0 }));
            });
        }
      }
    }),
    Prism.hooks.add("after-highlight", function (e) {
      (r.byLanguages["*"] || r.byLanguages[e.language]) &&
        r.initEvents(e.element, e.language);
    }),
    o))
      o[t].create();
  }
})();
!(function () {
  if ("undefined" != typeof self && self.Prism && self.document)
    if (Prism.plugins.toolbar) {
      var r = {
        html: "HTML",
        xml: "XML",
        svg: "SVG",
        mathml: "MathML",
        css: "CSS",
        clike: "C-like",
        js: "JavaScript",
        abap: "ABAP",
        abnf: "Augmented Backus–Naur form",
        apacheconf: "Apache Configuration",
        apl: "APL",
        arff: "ARFF",
        asciidoc: "AsciiDoc",
        adoc: "AsciiDoc",
        asm6502: "6502 Assembly",
        aspnet: "ASP.NET (C#)",
        autohotkey: "AutoHotkey",
        autoit: "AutoIt",
        shell: "Bash",
        basic: "BASIC",
        bnf: "Backus–Naur form",
        rbfn: "Routing Backus–Naur form",
        csharp: "C#",
        dotnet: "C#",
        cpp: "C++",
        cil: "CIL",
        csp: "Content-Security-Policy",
        "css-extras": "CSS Extras",
        django: "Django/Jinja2",
        jinja2: "Django/Jinja2",
        dockerfile: "Docker",
        ebnf: "Extended Backus–Naur form",
        ejs: "EJS",
        erb: "ERB",
        fsharp: "F#",
        gcode: "G-code",
        gedcom: "GEDCOM",
        glsl: "GLSL",
        gml: "GameMaker Language",
        gamemakerlanguage: "GameMaker Language",
        graphql: "GraphQL",
        hcl: "HCL",
        http: "HTTP",
        hpkp: "HTTP Public-Key-Pins",
        hsts: "HTTP Strict-Transport-Security",
        ichigojam: "IchigoJam",
        inform7: "Inform 7",
        javadoc: "JavaDoc",
        javadoclike: "JavaDoc-like",
        javastacktrace: "Java stack trace",
        jsdoc: "JSDoc",
        "js-extras": "JS Extras",
        json: "JSON",
        jsonp: "JSONP",
        json5: "JSON5",
        latex: "LaTeX",
        emacs: "Lisp",
        elisp: "Lisp",
        "emacs-lisp": "Lisp",
        lolcode: "LOLCODE",
        "markup-templating": "Markup templating",
        matlab: "MATLAB",
        mel: "MEL",
        n1ql: "N1QL",
        n4js: "N4JS",
        n4jsd: "N4JS",
        "nand2tetris-hdl": "Nand To Tetris HDL",
        nasm: "NASM",
        nginx: "nginx",
        nsis: "NSIS",
        objectivec: "Objective-C",
        ocaml: "OCaml",
        opencl: "OpenCL",
        parigp: "PARI/GP",
        objectpascal: "Object Pascal",
        php: "PHP",
        phpdoc: "PHPDoc",
        "php-extras": "PHP Extras",
        plsql: "PL/SQL",
        powershell: "PowerShell",
        properties: ".properties",
        protobuf: "Protocol Buffers",
        q: "Q (kdb+ database)",
        jsx: "React JSX",
        tsx: "React TSX",
        renpy: "Ren'py",
        rest: "reST (reStructuredText)",
        sas: "SAS",
        sass: "Sass (Sass)",
        scss: "Sass (Scss)",
        sql: "SQL",
        soy: "Soy (Closure Template)",
        tap: "TAP",
        toml: "TOML",
        tt2: "Template Toolkit 2",
        ts: "TypeScript",
        "t4-cs": "T4 Text Templates (C#)",
        t4: "T4 Text Templates (C#)",
        "t4-vb": "T4 Text Templates (VB)",
        "t4-templating": "T4 templating",
        vbnet: "VB.Net",
        vhdl: "VHDL",
        vim: "vim",
        "visual-basic": "Visual Basic",
        vb: "Visual Basic",
        wasm: "WebAssembly",
        wiki: "Wiki markup",
        xeoracube: "XeoraCube",
        xojo: "Xojo (REALbasic)",
        xquery: "XQuery",
        yaml: "YAML",
      };
      Prism.plugins.toolbar.registerButton("show-language", function (a) {
        var e = a.element.parentNode;
        if (e && /pre/i.test(e.nodeName)) {
          var s,
            t =
              e.getAttribute("data-language") ||
              r[a.language] ||
              ((s = a.language)
                ? (s.substring(0, 1).toUpperCase() + s.substring(1)).replace(
                    /s(?=cript)/,
                    "S"
                  )
                : s);
          if (t) {
            var o = document.createElement("span");
            return (o.textContent = t), o;
          }
        }
      });
    } else console.warn("Show Languages plugin loaded before Toolbar plugin.");
})();
!(function () {
  if ("undefined" != typeof self && self.Prism && self.document)
    if (Prism.plugins.toolbar) {
      var r = window.ClipboardJS || void 0;
      r || "function" != typeof require || (r = require("clipboard"));
      var i = [];
      if (!r) {
        var o = document.createElement("script"),
          e = document.querySelector("head");
        (o.onload = function () {
          if ((r = window.ClipboardJS)) for (; i.length; ) i.pop()();
        }),
          (o.src =
            "https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js"),
          e.appendChild(o);
      }
      Prism.plugins.toolbar.registerButton("copy-to-clipboard", function (e) {
        var t = document.createElement("a");
        return (t.textContent = "Copy"), r ? o() : i.push(o), t;
        function o() {
          var o = new r(t, {
            text: function () {
              return e.code;
            },
          });
          o.on("success", function () {
            (t.textContent = "Copied!"), n();
          }),
            o.on("error", function () {
              (t.textContent = "Press Ctrl+C to copy"), n();
            });
        }
        function n() {
          setTimeout(function () {
            t.textContent = "Copy";
          }, 5e3);
        }
      });
    } else
      console.warn("Copy to Clipboard plugin loaded before Toolbar plugin.");
})();
