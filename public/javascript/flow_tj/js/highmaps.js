/*
 Highmaps JS v6.0.3 (2017-11-14)

 (c) 2011-2016 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(S, K) {
	"object" === typeof module && module.exports ? module.exports = S.document ? K(S) : K : S.Highcharts = K(S)
})("undefined" !== typeof window ? window : this, function(S) {
	var K = function() {
		var a = "undefined" === typeof S ? window : S,
			y = a.document,
			C = a.navigator && a.navigator.userAgent || "",
			x = y && y.createElementNS && !!y.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect,
			f = /(edge|msie|trident)/i.test(C) && !a.opera,
			d = /Firefox/.test(C),
			v = d && 4 > parseInt(C.split("Firefox/")[1], 10);
		return a.Highcharts ? a.Highcharts.error(16, !0) : {
			product: "Highmaps",
			version: "6.0.3",
			deg2rad: 2 * Math.PI / 360,
			doc: y,
			hasBidiBug: v,
			hasTouch: y && void 0 !== y.documentElement.ontouchstart,
			isMS: f,
			isWebKit: /AppleWebKit/.test(C),
			isFirefox: d,
			isTouchDevice: /(Mobile|Android|Windows Phone)/.test(C),
			SVG_NS: "http://www.w3.org/2000/svg",
			chartCount: 0,
			seriesTypes: {},
			symbolSizes: {},
			svg: x,
			win: a,
			marginNames: ["plotTop", "marginRight", "marginBottom", "plotLeft"],
			noop: function() {},
			charts: []
		}
	}();
	(function(a) {
		a.timers = [];
		var y = a.charts,
			C = a.doc,
			x = a.win;
		a.error = function(f, d) {
			f =
				a.isNumber(f) ? "Highcharts error #" + f + ": www.highcharts.com/errors/" + f : f;
			if(d) throw Error(f);
			x.console && console.log(f)
		};
		a.Fx = function(a, d, v) {
			this.options = d;
			this.elem = a;
			this.prop = v
		};
		a.Fx.prototype = {
			dSetter: function() {
				var a = this.paths[0],
					d = this.paths[1],
					v = [],
					t = this.now,
					q = a.length,
					n;
				if(1 === t) v = this.toD;
				else if(q === d.length && 1 > t)
					for(; q--;) n = parseFloat(a[q]), v[q] = isNaN(n) ? d[q] : t * parseFloat(d[q] - n) + n;
				else v = d;
				this.elem.attr("d", v, null, !0)
			},
			update: function() {
				var a = this.elem,
					d = this.prop,
					v = this.now,
					t = this.options.step;
				if(this[d + "Setter"]) this[d + "Setter"]();
				else a.attr ? a.element && a.attr(d, v, null, !0) : a.style[d] = v + this.unit;
				t && t.call(a, v, this)
			},
			run: function(f, d, v) {
				var t = this,
					q = t.options,
					n = function(a) {
						return n.stopped ? !1 : t.step(a)
					},
					l = x.requestAnimationFrame || function(a) {
						setTimeout(a, 13)
					},
					g = function() {
						a.timers = a.grep(a.timers, function(a) {
							return a()
						});
						a.timers.length && l(g)
					};
				f === d ? (delete q.curAnim[this.prop], q.complete && 0 === a.keys(q.curAnim).length && q.complete()) : (this.startTime = +new Date, this.start = f, this.end = d, this.unit =
					v, this.now = this.start, this.pos = 0, n.elem = this.elem, n.prop = this.prop, n() && 1 === a.timers.push(n) && l(g))
			},
			step: function(f) {
				var d = +new Date,
					v, t = this.options,
					q = this.elem,
					n = t.complete,
					l = t.duration,
					g = t.curAnim;
				q.attr && !q.element ? f = !1 : f || d >= l + this.startTime ? (this.now = this.end, this.pos = 1, this.update(), v = g[this.prop] = !0, a.objectEach(g, function(a) {
					!0 !== a && (v = !1)
				}), v && n && n.call(q), f = !1) : (this.pos = t.easing((d - this.startTime) / l), this.now = this.start + (this.end - this.start) * this.pos, this.update(), f = !0);
				return f
			},
			initPath: function(f,
				d, v) {
				function t(a) {
					var b, e;
					for(c = a.length; c--;) b = "M" === a[c] || "L" === a[c], e = /[a-zA-Z]/.test(a[c + 3]), b && e && a.splice(c + 1, 0, a[c + 1], a[c + 2], a[c + 1], a[c + 2])
				}

				function q(a, b) {
					for(; a.length < e;) {
						a[0] = b[e - a.length];
						var g = a.slice(0, k);
						[].splice.apply(a, [0, 0].concat(g));
						h && (g = a.slice(a.length - k), [].splice.apply(a, [a.length, 0].concat(g)), c--)
					}
					a[0] = "M"
				}

				function n(a, c) {
					for(var g = (e - a.length) / k; 0 < g && g--;) b = a.slice().splice(a.length / D - k, k * D), b[0] = c[e - k - g * k], m && (b[k - 6] = b[k - 2], b[k - 5] = b[k - 1]), [].splice.apply(a, [a.length /
						D, 0
					].concat(b)), h && g--
				}
				d = d || "";
				var l, g = f.startX,
					r = f.endX,
					m = -1 < d.indexOf("C"),
					k = m ? 7 : 3,
					e, b, c;
				d = d.split(" ");
				v = v.slice();
				var h = f.isArea,
					D = h ? 2 : 1,
					I;
				m && (t(d), t(v));
				if(g && r) {
					for(c = 0; c < g.length; c++)
						if(g[c] === r[0]) {
							l = c;
							break
						} else if(g[0] === r[r.length - g.length + c]) {
						l = c;
						I = !0;
						break
					}
					void 0 === l && (d = [])
				}
				d.length && a.isNumber(l) && (e = v.length + l * D * k, I ? (q(d, v), n(v, d)) : (q(v, d), n(d, v)));
				return [d, v]
			}
		};
		a.Fx.prototype.fillSetter = a.Fx.prototype.strokeSetter = function() {
			this.elem.attr(this.prop, a.color(this.start).tweenTo(a.color(this.end),
				this.pos), null, !0)
		};
		a.extend = function(a, d) {
			var f;
			a || (a = {});
			for(f in d) a[f] = d[f];
			return a
		};
		a.merge = function() {
			var f, d = arguments,
				v, t = {},
				q = function(f, l) {
					"object" !== typeof f && (f = {});
					a.objectEach(l, function(g, r) {
						!a.isObject(g, !0) || a.isClass(g) || a.isDOMElement(g) ? f[r] = l[r] : f[r] = q(f[r] || {}, g)
					});
					return f
				};
			!0 === d[0] && (t = d[1], d = Array.prototype.slice.call(d, 2));
			v = d.length;
			for(f = 0; f < v; f++) t = q(t, d[f]);
			return t
		};
		a.pInt = function(a, d) {
			return parseInt(a, d || 10)
		};
		a.isString = function(a) {
			return "string" === typeof a
		};
		a.isArray =
			function(a) {
				a = Object.prototype.toString.call(a);
				return "[object Array]" === a || "[object Array Iterator]" === a
			};
		a.isObject = function(f, d) {
			return !!f && "object" === typeof f && (!d || !a.isArray(f))
		};
		a.isDOMElement = function(f) {
			return a.isObject(f) && "number" === typeof f.nodeType
		};
		a.isClass = function(f) {
			var d = f && f.constructor;
			return !(!a.isObject(f, !0) || a.isDOMElement(f) || !d || !d.name || "Object" === d.name)
		};
		a.isNumber = function(a) {
			return "number" === typeof a && !isNaN(a)
		};
		a.erase = function(a, d) {
			for(var f = a.length; f--;)
				if(a[f] ===
					d) {
					a.splice(f, 1);
					break
				}
		};
		a.defined = function(a) {
			return void 0 !== a && null !== a
		};
		a.attr = function(f, d, v) {
			var t;
			a.isString(d) ? a.defined(v) ? f.setAttribute(d, v) : f && f.getAttribute && (t = f.getAttribute(d)) : a.defined(d) && a.isObject(d) && a.objectEach(d, function(a, d) {
				f.setAttribute(d, a)
			});
			return t
		};
		a.splat = function(f) {
			return a.isArray(f) ? f : [f]
		};
		a.syncTimeout = function(a, d, v) {
			if(d) return setTimeout(a, d, v);
			a.call(0, v)
		};
		a.pick = function() {
			var a = arguments,
				d, v, t = a.length;
			for(d = 0; d < t; d++)
				if(v = a[d], void 0 !== v && null !== v) return v
		};
		a.css = function(f, d) {
			a.isMS && !a.svg && d && void 0 !== d.opacity && (d.filter = "alpha(opacity\x3d" + 100 * d.opacity + ")");
			a.extend(f.style, d)
		};
		a.createElement = function(f, d, v, t, q) {
			f = C.createElement(f);
			var n = a.css;
			d && a.extend(f, d);
			q && n(f, {
				padding: 0,
				border: "none",
				margin: 0
			});
			v && n(f, v);
			t && t.appendChild(f);
			return f
		};
		a.extendClass = function(f, d) {
			var v = function() {};
			v.prototype = new f;
			a.extend(v.prototype, d);
			return v
		};
		a.pad = function(a, d, v) {
			return Array((d || 2) + 1 - String(a).length).join(v || 0) + a
		};
		a.relativeLength = function(a,
			d, v) {
			return /%$/.test(a) ? d * parseFloat(a) / 100 + (v || 0) : parseFloat(a)
		};
		a.wrap = function(a, d, v) {
			var f = a[d];
			a[d] = function() {
				var a = Array.prototype.slice.call(arguments),
					d = arguments,
					l = this;
				l.proceed = function() {
					f.apply(l, arguments.length ? arguments : d)
				};
				a.unshift(f);
				a = v.apply(this, a);
				l.proceed = null;
				return a
			}
		};
		a.getTZOffset = function(f) {
			var d = a.Date;
			return 6E4 * (d.hcGetTimezoneOffset && d.hcGetTimezoneOffset(f) || d.hcTimezoneOffset || 0)
		};
		a.dateFormat = function(f, d, v) {
			if(!a.defined(d) || isNaN(d)) return a.defaultOptions.lang.invalidDate ||
				"";
			f = a.pick(f, "%Y-%m-%d %H:%M:%S");
			var t = a.Date,
				q = new t(d - a.getTZOffset(d)),
				n = q[t.hcGetHours](),
				l = q[t.hcGetDay](),
				g = q[t.hcGetDate](),
				r = q[t.hcGetMonth](),
				m = q[t.hcGetFullYear](),
				k = a.defaultOptions.lang,
				e = k.weekdays,
				b = k.shortWeekdays,
				c = a.pad,
				t = a.extend({
					a: b ? b[l] : e[l].substr(0, 3),
					A: e[l],
					d: c(g),
					e: c(g, 2, " "),
					w: l,
					b: k.shortMonths[r],
					B: k.months[r],
					m: c(r + 1),
					y: m.toString().substr(2, 2),
					Y: m,
					H: c(n),
					k: n,
					I: c(n % 12 || 12),
					l: n % 12 || 12,
					M: c(q[t.hcGetMinutes]()),
					p: 12 > n ? "AM" : "PM",
					P: 12 > n ? "am" : "pm",
					S: c(q.getSeconds()),
					L: c(Math.round(d %
						1E3), 3)
				}, a.dateFormats);
			a.objectEach(t, function(a, b) {
				for(; - 1 !== f.indexOf("%" + b);) f = f.replace("%" + b, "function" === typeof a ? a(d) : a)
			});
			return v ? f.substr(0, 1).toUpperCase() + f.substr(1) : f
		};
		a.formatSingle = function(f, d) {
			var v = /\.([0-9])/,
				t = a.defaultOptions.lang;
			/f$/.test(f) ? (v = (v = f.match(v)) ? v[1] : -1, null !== d && (d = a.numberFormat(d, v, t.decimalPoint, -1 < f.indexOf(",") ? t.thousandsSep : ""))) : d = a.dateFormat(f, d);
			return d
		};
		a.format = function(f, d) {
			for(var v = "{", t = !1, q, n, l, g, r = [], m; f;) {
				v = f.indexOf(v);
				if(-1 === v) break;
				q = f.slice(0, v);
				if(t) {
					q = q.split(":");
					n = q.shift().split(".");
					g = n.length;
					m = d;
					for(l = 0; l < g; l++) m && (m = m[n[l]]);
					q.length && (m = a.formatSingle(q.join(":"), m));
					r.push(m)
				} else r.push(q);
				f = f.slice(v + 1);
				v = (t = !t) ? "}" : "{"
			}
			r.push(f);
			return r.join("")
		};
		a.getMagnitude = function(a) {
			return Math.pow(10, Math.floor(Math.log(a) / Math.LN10))
		};
		a.normalizeTickInterval = function(f, d, v, t, q) {
			var n, l = f;
			v = a.pick(v, 1);
			n = f / v;
			d || (d = q ? [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10] : [1, 2, 2.5, 5, 10], !1 === t && (1 === v ? d = a.grep(d, function(a) {
					return 0 === a % 1
				}) : .1 >=
				v && (d = [1 / v])));
			for(t = 0; t < d.length && !(l = d[t], q && l * v >= f || !q && n <= (d[t] + (d[t + 1] || d[t])) / 2); t++);
			return l = a.correctFloat(l * v, -Math.round(Math.log(.001) / Math.LN10))
		};
		a.stableSort = function(a, d) {
			var f = a.length,
				t, q;
			for(q = 0; q < f; q++) a[q].safeI = q;
			a.sort(function(a, l) {
				t = d(a, l);
				return 0 === t ? a.safeI - l.safeI : t
			});
			for(q = 0; q < f; q++) delete a[q].safeI
		};
		a.arrayMin = function(a) {
			for(var d = a.length, f = a[0]; d--;) a[d] < f && (f = a[d]);
			return f
		};
		a.arrayMax = function(a) {
			for(var d = a.length, f = a[0]; d--;) a[d] > f && (f = a[d]);
			return f
		};
		a.destroyObjectProperties =
			function(f, d) {
				a.objectEach(f, function(a, t) {
					a && a !== d && a.destroy && a.destroy();
					delete f[t]
				})
			};
		a.discardElement = function(f) {
			var d = a.garbageBin;
			d || (d = a.createElement("div"));
			f && d.appendChild(f);
			d.innerHTML = ""
		};
		a.correctFloat = function(a, d) {
			return parseFloat(a.toPrecision(d || 14))
		};
		a.setAnimation = function(f, d) {
			d.renderer.globalAnimation = a.pick(f, d.options.chart.animation, !0)
		};
		a.animObject = function(f) {
			return a.isObject(f) ? a.merge(f) : {
				duration: f ? 500 : 0
			}
		};
		a.timeUnits = {
			millisecond: 1,
			second: 1E3,
			minute: 6E4,
			hour: 36E5,
			day: 864E5,
			week: 6048E5,
			month: 24192E5,
			year: 314496E5
		};
		a.numberFormat = function(f, d, v, t) {
			f = +f || 0;
			d = +d;
			var q = a.defaultOptions.lang,
				n = (f.toString().split(".")[1] || "").split("e")[0].length,
				l, g, r = f.toString().split("e"); - 1 === d ? d = Math.min(n, 20) : a.isNumber(d) || (d = 2);
			g = (Math.abs(r[1] ? r[0] : f) + Math.pow(10, -Math.max(d, n) - 1)).toFixed(d);
			n = String(a.pInt(g));
			l = 3 < n.length ? n.length % 3 : 0;
			v = a.pick(v, q.decimalPoint);
			t = a.pick(t, q.thousandsSep);
			f = (0 > f ? "-" : "") + (l ? n.substr(0, l) + t : "");
			f += n.substr(l).replace(/(\d{3})(?=\d)/g,
				"$1" + t);
			d && (f += v + g.slice(-d));
			r[1] && (f += "e" + r[1]);
			return f
		};
		Math.easeInOutSine = function(a) {
			return -.5 * (Math.cos(Math.PI * a) - 1)
		};
		a.getStyle = function(f, d, v) {
			if("width" === d) return Math.min(f.offsetWidth, f.scrollWidth) - a.getStyle(f, "padding-left") - a.getStyle(f, "padding-right");
			if("height" === d) return Math.min(f.offsetHeight, f.scrollHeight) - a.getStyle(f, "padding-top") - a.getStyle(f, "padding-bottom");
			x.getComputedStyle || a.error(27, !0);
			if(f = x.getComputedStyle(f, void 0)) f = f.getPropertyValue(d), a.pick(v, "opacity" !==
				d) && (f = a.pInt(f));
			return f
		};
		a.inArray = function(f, d) {
			return(a.indexOfPolyfill || Array.prototype.indexOf).call(d, f)
		};
		a.grep = function(f, d) {
			return(a.filterPolyfill || Array.prototype.filter).call(f, d)
		};
		a.find = Array.prototype.find ? function(a, d) {
			return a.find(d)
		} : function(a, d) {
			var f, t = a.length;
			for(f = 0; f < t; f++)
				if(d(a[f], f)) return a[f]
		};
		a.map = function(a, d) {
			for(var f = [], t = 0, q = a.length; t < q; t++) f[t] = d.call(a[t], a[t], t, a);
			return f
		};
		a.keys = function(f) {
			return(a.keysPolyfill || Object.keys).call(void 0, f)
		};
		a.reduce =
			function(f, d, v) {
				return(a.reducePolyfill || Array.prototype.reduce).call(f, d, v)
			};
		a.offset = function(a) {
			var d = C.documentElement;
			a = a.parentElement ? a.getBoundingClientRect() : {
				top: 0,
				left: 0
			};
			return {
				top: a.top + (x.pageYOffset || d.scrollTop) - (d.clientTop || 0),
				left: a.left + (x.pageXOffset || d.scrollLeft) - (d.clientLeft || 0)
			}
		};
		a.stop = function(f, d) {
			for(var v = a.timers.length; v--;) a.timers[v].elem !== f || d && d !== a.timers[v].prop || (a.timers[v].stopped = !0)
		};
		a.each = function(f, d, v) {
			return(a.forEachPolyfill || Array.prototype.forEach).call(f,
				d, v)
		};
		a.objectEach = function(a, d, v) {
			for(var f in a) a.hasOwnProperty(f) && d.call(v, a[f], f, a)
		};
		a.addEvent = function(f, d, v) {
			var t, q, n = f.addEventListener || a.addEventListenerPolyfill;
			f.hcEvents && !f.hasOwnProperty("hcEvents") && (q = {}, a.objectEach(f.hcEvents, function(a, g) {
				q[g] = a.slice(0)
			}), f.hcEvents = q);
			t = f.hcEvents = f.hcEvents || {};
			n && n.call(f, d, v, !1);
			t[d] || (t[d] = []);
			t[d].push(v);
			return function() {
				a.removeEvent(f, d, v)
			}
		};
		a.removeEvent = function(f, d, v) {
			function t(g, l) {
				var k = f.removeEventListener || a.removeEventListenerPolyfill;
				k && k.call(f, g, l, !1)
			}

			function q() {
				var g, m;
				f.nodeName && (d ? (g = {}, g[d] = !0) : g = l, a.objectEach(g, function(a, e) {
					if(l[e])
						for(m = l[e].length; m--;) t(e, l[e][m])
				}))
			}
			var n, l = f.hcEvents,
				g;
			l && (d ? (n = l[d] || [], v ? (g = a.inArray(v, n), -1 < g && (n.splice(g, 1), l[d] = n), t(d, v)) : (q(), l[d] = [])) : (q(), f.hcEvents = {}))
		};
		a.fireEvent = function(f, d, v, t) {
			var q;
			q = f.hcEvents;
			var n, l;
			v = v || {};
			if(C.createEvent && (f.dispatchEvent || f.fireEvent)) q = C.createEvent("Events"), q.initEvent(d, !0, !0), a.extend(q, v), f.dispatchEvent ? f.dispatchEvent(q) : f.fireEvent(d,
				q);
			else if(q)
				for(q = q[d] || [], n = q.length, v.target || a.extend(v, {
						preventDefault: function() {
							v.defaultPrevented = !0
						},
						target: f,
						type: d
					}), d = 0; d < n; d++)(l = q[d]) && !1 === l.call(f, v) && v.preventDefault();
			t && !v.defaultPrevented && t(v)
		};
		a.animate = function(f, d, v) {
			var t, q = "",
				n, l, g;
			a.isObject(v) || (g = arguments, v = {
				duration: g[2],
				easing: g[3],
				complete: g[4]
			});
			a.isNumber(v.duration) || (v.duration = 400);
			v.easing = "function" === typeof v.easing ? v.easing : Math[v.easing] || Math.easeInOutSine;
			v.curAnim = a.merge(d);
			a.objectEach(d, function(g,
				m) {
				a.stop(f, m);
				l = new a.Fx(f, v, m);
				n = null;
				"d" === m ? (l.paths = l.initPath(f, f.d, d.d), l.toD = d.d, t = 0, n = 1) : f.attr ? t = f.attr(m) : (t = parseFloat(a.getStyle(f, m)) || 0, "opacity" !== m && (q = "px"));
				n || (n = g);
				n && n.match && n.match("px") && (n = n.replace(/px/g, ""));
				l.run(t, n, q)
			})
		};
		a.seriesType = function(f, d, v, t, q) {
			var n = a.getOptions(),
				l = a.seriesTypes;
			n.plotOptions[f] = a.merge(n.plotOptions[d], v);
			l[f] = a.extendClass(l[d] || function() {}, t);
			l[f].prototype.type = f;
			q && (l[f].prototype.pointClass = a.extendClass(a.Point, q));
			return l[f]
		};
		a.uniqueKey =
			function() {
				var a = Math.random().toString(36).substring(2, 9),
					d = 0;
				return function() {
					return "highcharts-" + a + "-" + d++
				}
			}();
		x.jQuery && (x.jQuery.fn.highcharts = function() {
			var f = [].slice.call(arguments);
			if(this[0]) return f[0] ? (new(a[a.isString(f[0]) ? f.shift() : "Chart"])(this[0], f[0], f[1]), this) : y[a.attr(this[0], "data-highcharts-chart")]
		})
	})(K);
	(function(a) {
		var y = a.each,
			C = a.isNumber,
			x = a.map,
			f = a.merge,
			d = a.pInt;
		a.Color = function(d) {
			if(!(this instanceof a.Color)) return new a.Color(d);
			this.init(d)
		};
		a.Color.prototype = {
			parsers: [{
				regex: /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,
				parse: function(a) {
					return [d(a[1]), d(a[2]), d(a[3]), parseFloat(a[4], 10)]
				}
			}, {
				regex: /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,
				parse: function(a) {
					return [d(a[1]), d(a[2]), d(a[3]), 1]
				}
			}],
			names: {
				none: "rgba(255,255,255,0)",
				white: "#ffffff",
				black: "#000000"
			},
			init: function(d) {
				var f, q, n, l;
				if((this.input = d = this.names[d && d.toLowerCase ? d.toLowerCase() : ""] || d) && d.stops) this.stops = x(d.stops,
					function(g) {
						return new a.Color(g[1])
					});
				else if(d && d.charAt && "#" === d.charAt() && (f = d.length, d = parseInt(d.substr(1), 16), 7 === f ? q = [(d & 16711680) >> 16, (d & 65280) >> 8, d & 255, 1] : 4 === f && (q = [(d & 3840) >> 4 | (d & 3840) >> 8, (d & 240) >> 4 | d & 240, (d & 15) << 4 | d & 15, 1])), !q)
					for(n = this.parsers.length; n-- && !q;) l = this.parsers[n], (f = l.regex.exec(d)) && (q = l.parse(f));
				this.rgba = q || []
			},
			get: function(a) {
				var d = this.input,
					q = this.rgba,
					n;
				this.stops ? (n = f(d), n.stops = [].concat(n.stops), y(this.stops, function(l, g) {
						n.stops[g] = [n.stops[g][0], l.get(a)]
					})) :
					n = q && C(q[0]) ? "rgb" === a || !a && 1 === q[3] ? "rgb(" + q[0] + "," + q[1] + "," + q[2] + ")" : "a" === a ? q[3] : "rgba(" + q.join(",") + ")" : d;
				return n
			},
			brighten: function(a) {
				var f, q = this.rgba;
				if(this.stops) y(this.stops, function(d) {
					d.brighten(a)
				});
				else if(C(a) && 0 !== a)
					for(f = 0; 3 > f; f++) q[f] += d(255 * a), 0 > q[f] && (q[f] = 0), 255 < q[f] && (q[f] = 255);
				return this
			},
			setOpacity: function(a) {
				this.rgba[3] = a;
				return this
			},
			tweenTo: function(a, d) {
				var f = this.rgba,
					n = a.rgba;
				n.length && f && f.length ? (a = 1 !== n[3] || 1 !== f[3], d = (a ? "rgba(" : "rgb(") + Math.round(n[0] + (f[0] -
					n[0]) * (1 - d)) + "," + Math.round(n[1] + (f[1] - n[1]) * (1 - d)) + "," + Math.round(n[2] + (f[2] - n[2]) * (1 - d)) + (a ? "," + (n[3] + (f[3] - n[3]) * (1 - d)) : "") + ")") : d = a.input || "none";
				return d
			}
		};
		a.color = function(d) {
			return new a.Color(d)
		}
	})(K);
	(function(a) {
		function y() {
			var d = a.defaultOptions.global,
				f = t.moment;
			if(d.timezone) {
				if(f) return function(a) {
					return -f.tz(a, d.timezone).utcOffset()
				};
				a.error(25)
			}
			return d.useUTC && d.getTimezoneOffset
		}

		function C() {
			var d = a.defaultOptions.global,
				n, l = d.useUTC,
				g = l ? "getUTC" : "get",
				r = l ? "setUTC" : "set",
				m = "Minutes Hours Day Date Month FullYear".split(" "),
				k = m.concat(["Milliseconds", "Seconds"]);
			a.Date = n = d.Date || t.Date;
			n.hcTimezoneOffset = l && d.timezoneOffset;
			n.hcGetTimezoneOffset = y();
			n.hcMakeTime = function(a, b, c, k, g, d) {
				var e;
				l ? (e = n.UTC.apply(0, arguments), e += f(e)) : e = (new n(a, b, v(c, 1), v(k, 0), v(g, 0), v(d, 0))).getTime();
				return e
			};
			for(d = 0; d < m.length; d++) n["hcGet" + m[d]] = g + m[d];
			for(d = 0; d < k.length; d++) n["hcSet" + k[d]] = r + k[d]
		}
		var x = a.color,
			f = a.getTZOffset,
			d = a.merge,
			v = a.pick,
			t = a.win;
		a.defaultOptions = {
			colors: "#7cb5ec #434348 #90ed7d #f7a35c #8085e9 #f15c80 #e4d354 #2b908f #f45b5b #91e8e1".split(" "),
			symbols: ["circle", "diamond", "square", "triangle", "triangle-down"],
			lang: {
				loading: "Loading...",
				months: "January February March April May June July August September October November December".split(" "),
				shortMonths: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
				weekdays: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
				decimalPoint: ".",
				numericSymbols: "kMGTPE".split(""),
				resetZoom: "Reset zoom",
				resetZoomTitle: "Reset zoom level 1:1",
				thousandsSep: " "
			},
			global: {
				useUTC: !0
			},
			chart: {
				borderRadius: 0,
				defaultSeriesType: "line",
				ignoreHiddenSeries: !0,
				spacing: [10, 10, 15, 10],
				resetZoomButton: {
					theme: {
						zIndex: 20
					},
					position: {
						align: "right",
						x: -10,
						y: 10
					}
				},
				width: null,
				height: null,
				borderColor: "#335cad",
				backgroundColor: "#ffffff",
				plotBorderColor: "#cccccc"
			},
			title: {
				text: "Chart title",
				align: "center",
				margin: 15,
				widthAdjust: -44
			},
			subtitle: {
				text: "",
				align: "center",
				widthAdjust: -44
			},
			plotOptions: {},
			labels: {
				style: {
					position: "absolute",
					color: "#333333"
				}
			},
			legend: {
				enabled: !0,
				align: "center",
				layout: "horizontal",
				labelFormatter: function() {
					return this.name
				},
				borderColor: "#999999",
				borderRadius: 0,
				navigation: {
					activeColor: "#003399",
					inactiveColor: "#cccccc"
				},
				itemStyle: {
					color: "#333333",
					fontSize: "12px",
					fontWeight: "bold",
					textOverflow: "ellipsis"
				},
				itemHoverStyle: {
					color: "#000000"
				},
				itemHiddenStyle: {
					color: "#cccccc"
				},
				shadow: !1,
				itemCheckboxStyle: {
					position: "absolute",
					width: "13px",
					height: "13px"
				},
				squareSymbol: !0,
				symbolPadding: 5,
				verticalAlign: "bottom",
				x: 0,
				y: 0,
				title: {
					style: {
						fontWeight: "bold"
					}
				}
			},
			loading: {
				labelStyle: {
					fontWeight: "bold",
					position: "relative",
					top: "45%"
				},
				style: {
					position: "absolute",
					backgroundColor: "#ffffff",
					opacity: .5,
					textAlign: "center"
				}
			},
			tooltip: {
				enabled: !0,
				animation: a.svg,
				borderRadius: 3,
				dateTimeLabelFormats: {
					millisecond: "%A, %b %e, %H:%M:%S.%L",
					second: "%A, %b %e, %H:%M:%S",
					minute: "%A, %b %e, %H:%M",
					hour: "%A, %b %e, %H:%M",
					day: "%A, %b %e, %Y",
					week: "Week from %A, %b %e, %Y",
					month: "%B %Y",
					year: "%Y"
				},
				footerFormat: "",
				padding: 8,
				snap: a.isTouchDevice ? 25 : 10,
				backgroundColor: x("#f7f7f7").setOpacity(.85).get(),
				borderWidth: 1,
				headerFormat: '\x3cspan style\x3d"font-size: 10px"\x3e{point.key}\x3c/span\x3e\x3cbr/\x3e',
				pointFormat: '\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3e',
				shadow: !0,
				style: {
					color: "#333333",
					cursor: "default",
					fontSize: "12px",
					pointerEvents: "none",
					whiteSpace: "nowrap"
				}
			},
			credits: {
				enabled: !0,
//				href: "http://www.highcharts.com",
				position: {
					align: "right",
					x: -10,
					verticalAlign: "bottom",
					y: -5
				},
				style: {
					cursor: "pointer",
					color: "#999999",
					fontSize: "9px"
				},
				text: ""
				//Highcharts.com   此位置标注网址出处
			}
		};
		a.setOptions = function(f) {
			a.defaultOptions = d(!0, a.defaultOptions, f);
			C();
			return a.defaultOptions
		};
		a.getOptions = function() {
			return a.defaultOptions
		};
		a.defaultPlotOptions = a.defaultOptions.plotOptions;
		C()
	})(K);
	(function(a) {
		var y, C, x = a.addEvent,
			f = a.animate,
			d = a.attr,
			v = a.charts,
			t = a.color,
			q = a.css,
			n = a.createElement,
			l = a.defined,
			g = a.deg2rad,
			r = a.destroyObjectProperties,
			m = a.doc,
			k = a.each,
			e = a.extend,
			b = a.erase,
			c = a.grep,
			h = a.hasTouch,
			D = a.inArray,
			I = a.isArray,
			B = a.isFirefox,
			J = a.isMS,
			F = a.isObject,
			z = a.isString,
			N = a.isWebKit,
			w = a.merge,
			G = a.noop,
			E = a.objectEach,
			H = a.pick,
			p = a.pInt,
			u = a.removeEvent,
			Q = a.stop,
			M = a.svg,
			O = a.SVG_NS,
			L = a.symbolSizes,
			R = a.win;
		y = a.SVGElement = function() {
			return this
		};
		e(y.prototype, {
			opacity: 1,
			SVG_NS: O,
			textProps: "direction fontSize fontWeight fontFamily fontStyle color lineHeight width textAlign textDecoration textOverflow textOutline".split(" "),
			init: function(a, b) {
				this.element = "span" === b ? n(b) : m.createElementNS(this.SVG_NS, b);
				this.renderer = a
			},
			animate: function(b, p, c) {
				p = a.animObject(H(p, this.renderer.globalAnimation, !0));
				0 !== p.duration ? (c && (p.complete = c), f(this, b, p)) : (this.attr(b,
					null, c), p.step && p.step.call(this));
				return this
			},
			colorGradient: function(b, p, c) {
				var A = this.renderer,
					u, e, h, P, g, d, M, m, G, L, r = [],
					f;
				b.radialGradient ? e = "radialGradient" : b.linearGradient && (e = "linearGradient");
				e && (h = b[e], g = A.gradients, M = b.stops, L = c.radialReference, I(h) && (b[e] = h = {
						x1: h[0],
						y1: h[1],
						x2: h[2],
						y2: h[3],
						gradientUnits: "userSpaceOnUse"
					}), "radialGradient" === e && L && !l(h.gradientUnits) && (P = h, h = w(h, A.getRadialAttr(L, P), {
						gradientUnits: "userSpaceOnUse"
					})), E(h, function(a, b) {
						"id" !== b && r.push(b, a)
					}), E(M, function(a) {
						r.push(a)
					}),
					r = r.join(","), g[r] ? L = g[r].attr("id") : (h.id = L = a.uniqueKey(), g[r] = d = A.createElement(e).attr(h).add(A.defs), d.radAttr = P, d.stops = [], k(M, function(b) {
						0 === b[1].indexOf("rgba") ? (u = a.color(b[1]), m = u.get("rgb"), G = u.get("a")) : (m = b[1], G = 1);
						b = A.createElement("stop").attr({
							offset: b[0],
							"stop-color": m,
							"stop-opacity": G
						}).add(d);
						d.stops.push(b)
					})), f = "url(" + A.url + "#" + L + ")", c.setAttribute(p, f), c.gradient = r, b.toString = function() {
						return f
					})
			},
			applyTextOutline: function(A) {
				var p = this.element,
					c, u, e, h, g; - 1 !== A.indexOf("contrast") &&
					(A = A.replace(/contrast/g, this.renderer.getContrast(p.style.fill)));
				A = A.split(" ");
				u = A[A.length - 1];
				if((e = A[0]) && "none" !== e && a.svg) {
					this.fakeTS = !0;
					A = [].slice.call(p.getElementsByTagName("tspan"));
					this.ySetter = this.xSetter;
					e = e.replace(/(^[\d\.]+)(.*?)$/g, function(a, b, A) {
						return 2 * b + A
					});
					for(g = A.length; g--;) c = A[g], "highcharts-text-outline" === c.getAttribute("class") && b(A, p.removeChild(c));
					h = p.firstChild;
					k(A, function(a, b) {
						0 === b && (a.setAttribute("x", p.getAttribute("x")), b = p.getAttribute("y"), a.setAttribute("y",
							b || 0), null === b && p.setAttribute("y", 0));
						a = a.cloneNode(1);
						d(a, {
							"class": "highcharts-text-outline",
							fill: u,
							stroke: u,
							"stroke-width": e,
							"stroke-linejoin": "round"
						});
						p.insertBefore(a, h)
					})
				}
			},
			attr: function(a, b, p, c) {
				var A, u = this.element,
					e, k = this,
					h, g;
				"string" === typeof a && void 0 !== b && (A = a, a = {}, a[A] = b);
				"string" === typeof a ? k = (this[a + "Getter"] || this._defaultGetter).call(this, a, u) : (E(a, function(b, A) {
					h = !1;
					c || Q(this, A);
					this.symbolName && /^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)$/.test(A) && (e || (this.symbolAttr(a),
						e = !0), h = !0);
					!this.rotation || "x" !== A && "y" !== A || (this.doTransform = !0);
					h || (g = this[A + "Setter"] || this._defaultSetter, g.call(this, b, A, u), this.shadows && /^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(A) && this.updateShadows(A, b, g))
				}, this), this.afterSetters());
				p && p();
				return k
			},
			afterSetters: function() {
				this.doTransform && (this.updateTransform(), this.doTransform = !1)
			},
			updateShadows: function(a, b, p) {
				for(var A = this.shadows, c = A.length; c--;) p.call(A[c], "height" === a ? Math.max(b - (A[c].cutHeight || 0), 0) : "d" ===
					a ? this.d : b, a, A[c])
			},
			addClass: function(a, b) {
				var A = this.attr("class") || ""; - 1 === A.indexOf(a) && (b || (a = (A + (A ? " " : "") + a).replace("  ", " ")), this.attr("class", a));
				return this
			},
			hasClass: function(a) {
				return -1 !== D(a, (this.attr("class") || "").split(" "))
			},
			removeClass: function(a) {
				return this.attr("class", (this.attr("class") || "").replace(a, ""))
			},
			symbolAttr: function(a) {
				var b = this;
				k("x y r start end width height innerR anchorX anchorY".split(" "), function(A) {
					b[A] = H(a[A], b[A])
				});
				b.attr({
					d: b.renderer.symbols[b.symbolName](b.x,
						b.y, b.width, b.height, b)
				})
			},
			clip: function(a) {
				return this.attr("clip-path", a ? "url(" + this.renderer.url + "#" + a.id + ")" : "none")
			},
			crisp: function(a, b) {
				var A = this,
					p = {},
					c;
				b = b || a.strokeWidth || 0;
				c = Math.round(b) % 2 / 2;
				a.x = Math.floor(a.x || A.x || 0) + c;
				a.y = Math.floor(a.y || A.y || 0) + c;
				a.width = Math.floor((a.width || A.width || 0) - 2 * c);
				a.height = Math.floor((a.height || A.height || 0) - 2 * c);
				l(a.strokeWidth) && (a.strokeWidth = b);
				E(a, function(a, b) {
					A[b] !== a && (A[b] = p[b] = a)
				});
				return p
			},
			css: function(a) {
				var b = this.styles,
					A = {},
					c = this.element,
					u, k = "",
					h, g = !b,
					w = ["textOutline", "textOverflow", "width"];
				a && a.color && (a.fill = a.color);
				b && E(a, function(a, p) {
					a !== b[p] && (A[p] = a, g = !0)
				});
				g && (b && (a = e(b, A)), u = this.textWidth = a && a.width && "auto" !== a.width && "text" === c.nodeName.toLowerCase() && p(a.width), this.styles = a, u && !M && this.renderer.forExport && delete a.width, J && !M ? q(this.element, a) : (h = function(a, b) {
					return "-" + b.toLowerCase()
				}, E(a, function(a, b) {
					-1 === D(b, w) && (k += b.replace(/([A-Z])/g, h) + ":" + a + ";")
				}), k && d(c, "style", k)), this.added && ("text" === this.element.nodeName &&
					this.renderer.buildText(this), a && a.textOutline && this.applyTextOutline(a.textOutline)));
				return this
			},
			strokeWidth: function() {
				return this["stroke-width"] || 0
			},
			on: function(a, b) {
				var A = this,
					p = A.element;
				h && "click" === a ? (p.ontouchstart = function(a) {
					A.touchEventFired = Date.now();
					a.preventDefault();
					b.call(p, a)
				}, p.onclick = function(a) {
					(-1 === R.navigator.userAgent.indexOf("Android") || 1100 < Date.now() - (A.touchEventFired || 0)) && b.call(p, a)
				}) : p["on" + a] = b;
				return this
			},
			setRadialReference: function(a) {
				var b = this.renderer.gradients[this.element.gradient];
				this.element.radialReference = a;
				b && b.radAttr && b.animate(this.renderer.getRadialAttr(a, b.radAttr));
				return this
			},
			translate: function(a, b) {
				return this.attr({
					translateX: a,
					translateY: b
				})
			},
			invert: function(a) {
				this.inverted = a;
				this.updateTransform();
				return this
			},
			updateTransform: function() {
				var a = this.translateX || 0,
					b = this.translateY || 0,
					p = this.scaleX,
					c = this.scaleY,
					u = this.inverted,
					e = this.rotation,
					k = this.matrix,
					h = this.element;
				u && (a += this.width, b += this.height);
				a = ["translate(" + a + "," + b + ")"];
				l(k) && a.push("matrix(" + k.join(",") +
					")");
				u ? a.push("rotate(90) scale(-1,1)") : e && a.push("rotate(" + e + " " + H(this.rotationOriginX, h.getAttribute("x"), 0) + " " + H(this.rotationOriginY, h.getAttribute("y") || 0) + ")");
				(l(p) || l(c)) && a.push("scale(" + H(p, 1) + " " + H(c, 1) + ")");
				a.length && h.setAttribute("transform", a.join(" "))
			},
			toFront: function() {
				var a = this.element;
				a.parentNode.appendChild(a);
				return this
			},
			align: function(a, p, c) {
				var A, u, e, k, h = {};
				u = this.renderer;
				e = u.alignedObjects;
				var g, w;
				if(a) {
					if(this.alignOptions = a, this.alignByTranslate = p, !c || z(c)) this.alignTo =
						A = c || "renderer", b(e, this), e.push(this), c = null
				} else a = this.alignOptions, p = this.alignByTranslate, A = this.alignTo;
				c = H(c, u[A], u);
				A = a.align;
				u = a.verticalAlign;
				e = (c.x || 0) + (a.x || 0);
				k = (c.y || 0) + (a.y || 0);
				"right" === A ? g = 1 : "center" === A && (g = 2);
				g && (e += (c.width - (a.width || 0)) / g);
				h[p ? "translateX" : "x"] = Math.round(e);
				"bottom" === u ? w = 1 : "middle" === u && (w = 2);
				w && (k += (c.height - (a.height || 0)) / w);
				h[p ? "translateY" : "y"] = Math.round(k);
				this[this.placed ? "animate" : "attr"](h);
				this.placed = !0;
				this.alignAttr = h;
				return this
			},
			getBBox: function(a,
				b) {
				var p, A = this.renderer,
					c, u = this.element,
					h = this.styles,
					w, d = this.textStr,
					P, M = A.cache,
					m = A.cacheKeys,
					L;
				b = H(b, this.rotation);
				c = b * g;
				w = h && h.fontSize;
				l(d) && (L = d.toString(), -1 === L.indexOf("\x3c") && (L = L.replace(/[0-9]/g, "0")), L += ["", b || 0, w, h && h.width, h && h.textOverflow].join());
				L && !a && (p = M[L]);
				if(!p) {
					if(u.namespaceURI === this.SVG_NS || A.forExport) {
						try {
							(P = this.fakeTS && function(a) {
								k(u.querySelectorAll(".highcharts-text-outline"), function(b) {
									b.style.display = a
								})
							}) && P("none"), p = u.getBBox ? e({}, u.getBBox()) : {
								width: u.offsetWidth,
								height: u.offsetHeight
							}, P && P("")
						} catch(W) {}
						if(!p || 0 > p.width) p = {
							width: 0,
							height: 0
						}
					} else p = this.htmlGetBBox();
					A.isSVG && (a = p.width, A = p.height, h && "11px" === h.fontSize && 17 === Math.round(A) && (p.height = A = 14), b && (p.width = Math.abs(A * Math.sin(c)) + Math.abs(a * Math.cos(c)), p.height = Math.abs(A * Math.cos(c)) + Math.abs(a * Math.sin(c))));
					if(L && 0 < p.height) {
						for(; 250 < m.length;) delete M[m.shift()];
						M[L] || m.push(L);
						M[L] = p
					}
				}
				return p
			},
			show: function(a) {
				return this.attr({
					visibility: a ? "inherit" : "visible"
				})
			},
			hide: function() {
				return this.attr({
					visibility: "hidden"
				})
			},
			fadeOut: function(a) {
				var b = this;
				b.animate({
					opacity: 0
				}, {
					duration: a || 150,
					complete: function() {
						b.attr({
							y: -9999
						})
					}
				})
			},
			add: function(a) {
				var b = this.renderer,
					p = this.element,
					c;
				a && (this.parentGroup = a);
				this.parentInverted = a && a.inverted;
				void 0 !== this.textStr && b.buildText(this);
				this.added = !0;
				if(!a || a.handleZ || this.zIndex) c = this.zIndexSetter();
				c || (a ? a.element : b.box).appendChild(p);
				if(this.onAdd) this.onAdd();
				return this
			},
			safeRemoveChild: function(a) {
				var b = a.parentNode;
				b && b.removeChild(a)
			},
			destroy: function() {
				var a =
					this,
					p = a.element || {},
					c = a.renderer.isSVG && "SPAN" === p.nodeName && a.parentGroup,
					u = p.ownerSVGElement;
				p.onclick = p.onmouseout = p.onmouseover = p.onmousemove = p.point = null;
				Q(a);
				a.clipPath && u && (k(u.querySelectorAll("[clip-path],[CLIP-PATH]"), function(b) {
					b.getAttribute("clip-path").match(RegExp('[("]#' + a.clipPath.element.id + '[)"]')) && b.removeAttribute("clip-path")
				}), a.clipPath = a.clipPath.destroy());
				if(a.stops) {
					for(u = 0; u < a.stops.length; u++) a.stops[u] = a.stops[u].destroy();
					a.stops = null
				}
				a.safeRemoveChild(p);
				for(a.destroyShadows(); c &&
					c.div && 0 === c.div.childNodes.length;) p = c.parentGroup, a.safeRemoveChild(c.div), delete c.div, c = p;
				a.alignTo && b(a.renderer.alignedObjects, a);
				E(a, function(b, p) {
					delete a[p]
				});
				return null
			},
			shadow: function(a, b, p) {
				var c = [],
					u, A, e = this.element,
					k, h, g, w;
				if(!a) this.destroyShadows();
				else if(!this.shadows) {
					h = H(a.width, 3);
					g = (a.opacity || .15) / h;
					w = this.parentInverted ? "(-1,-1)" : "(" + H(a.offsetX, 1) + ", " + H(a.offsetY, 1) + ")";
					for(u = 1; u <= h; u++) A = e.cloneNode(0), k = 2 * h + 1 - 2 * u, d(A, {
						isShadow: "true",
						stroke: a.color || "#000000",
						"stroke-opacity": g *
							u,
						"stroke-width": k,
						transform: "translate" + w,
						fill: "none"
					}), p && (d(A, "height", Math.max(d(A, "height") - k, 0)), A.cutHeight = k), b ? b.element.appendChild(A) : e.parentNode && e.parentNode.insertBefore(A, e), c.push(A);
					this.shadows = c
				}
				return this
			},
			destroyShadows: function() {
				k(this.shadows || [], function(a) {
					this.safeRemoveChild(a)
				}, this);
				this.shadows = void 0
			},
			xGetter: function(a) {
				"circle" === this.element.nodeName && ("x" === a ? a = "cx" : "y" === a && (a = "cy"));
				return this._defaultGetter(a)
			},
			_defaultGetter: function(a) {
				a = H(this[a], this.element ?
					this.element.getAttribute(a) : null, 0);
				/^[\-0-9\.]+$/.test(a) && (a = parseFloat(a));
				return a
			},
			dSetter: function(a, b, p) {
				a && a.join && (a = a.join(" "));
				/(NaN| {2}|^$)/.test(a) && (a = "M 0 0");
				this[b] !== a && (p.setAttribute(b, a), this[b] = a)
			},
			dashstyleSetter: function(a) {
				var b, c = this["stroke-width"];
				"inherit" === c && (c = 1);
				if(a = a && a.toLowerCase()) {
					a = a.replace("shortdashdotdot", "3,1,1,1,1,1,").replace("shortdashdot", "3,1,1,1").replace("shortdot", "1,1,").replace("shortdash", "3,1,").replace("longdash", "8,3,").replace(/dot/g,
						"1,3,").replace("dash", "4,3,").replace(/,$/, "").split(",");
					for(b = a.length; b--;) a[b] = p(a[b]) * c;
					a = a.join(",").replace(/NaN/g, "none");
					this.element.setAttribute("stroke-dasharray", a)
				}
			},
			alignSetter: function(a) {
				this.element.setAttribute("text-anchor", {
					left: "start",
					center: "middle",
					right: "end"
				}[a])
			},
			opacitySetter: function(a, b, p) {
				this[b] = a;
				p.setAttribute(b, a)
			},
			titleSetter: function(a) {
				var b = this.element.getElementsByTagName("title")[0];
				b || (b = m.createElementNS(this.SVG_NS, "title"), this.element.appendChild(b));
				b.firstChild && b.removeChild(b.firstChild);
				b.appendChild(m.createTextNode(String(H(a), "").replace(/<[^>]*>/g, "")))
			},
			textSetter: function(a) {
				a !== this.textStr && (delete this.bBox, this.textStr = a, this.added && this.renderer.buildText(this))
			},
			fillSetter: function(a, b, p) {
				"string" === typeof a ? p.setAttribute(b, a) : a && this.colorGradient(a, b, p)
			},
			visibilitySetter: function(a, b, p) {
				"inherit" === a ? p.removeAttribute(b) : this[b] !== a && p.setAttribute(b, a);
				this[b] = a
			},
			zIndexSetter: function(a, b) {
				var c = this.renderer,
					u = this.parentGroup,
					e = (u || c).element || c.box,
					k, h = this.element,
					A, g, c = e === c.box;
				k = this.added;
				var w;
				l(a) && (h.zIndex = a, a = +a, this[b] === a && (k = !1), this[b] = a);
				if(k) {
					(a = this.zIndex) && u && (u.handleZ = !0);
					b = e.childNodes;
					for(w = b.length - 1; 0 <= w && !A; w--)
						if(u = b[w], k = u.zIndex, g = !l(k), u !== h)
							if(0 > a && g && !c && !w) e.insertBefore(h, b[w]), A = !0;
							else if(p(k) <= a || g && (!l(a) || 0 <= a)) e.insertBefore(h, b[w + 1] || null), A = !0;
					A || (e.insertBefore(h, b[c ? 3 : 0] || null), A = !0)
				}
				return A
			},
			_defaultSetter: function(a, b, p) {
				p.setAttribute(b, a)
			}
		});
		y.prototype.yGetter = y.prototype.xGetter;
		y.prototype.translateXSetter = y.prototype.translateYSetter = y.prototype.rotationSetter = y.prototype.verticalAlignSetter = y.prototype.rotationOriginXSetter = y.prototype.rotationOriginYSetter = y.prototype.scaleXSetter = y.prototype.scaleYSetter = y.prototype.matrixSetter = function(a, b) {
			this[b] = a;
			this.doTransform = !0
		};
		y.prototype["stroke-widthSetter"] = y.prototype.strokeSetter = function(a, b, p) {
			this[b] = a;
			this.stroke && this["stroke-width"] ? (y.prototype.fillSetter.call(this, this.stroke, "stroke", p), p.setAttribute("stroke-width",
				this["stroke-width"]), this.hasStroke = !0) : "stroke-width" === b && 0 === a && this.hasStroke && (p.removeAttribute("stroke"), this.hasStroke = !1)
		};
		C = a.SVGRenderer = function() {
			this.init.apply(this, arguments)
		};
		e(C.prototype, {
			Element: y,
			SVG_NS: O,
			init: function(a, b, p, c, u, e) {
				var k;
				c = this.createElement("svg").attr({
					version: "1.1",
					"class": "highcharts-root"
				}).css(this.getStyle(c));
				k = c.element;
				a.appendChild(k);
				d(a, "dir", "ltr"); - 1 === a.innerHTML.indexOf("xmlns") && d(k, "xmlns", this.SVG_NS);
				this.isSVG = !0;
				this.box = k;
				this.boxWrapper =
					c;
				this.alignedObjects = [];
				this.url = (B || N) && m.getElementsByTagName("base").length ? R.location.href.replace(/#.*?$/, "").replace(/<[^>]*>/g, "").replace(/([\('\)])/g, "\\$1").replace(/ /g, "%20") : "";
				this.createElement("desc").add().element.appendChild(m.createTextNode("Created with Highmaps 6.0.3"));
				this.defs = this.createElement("defs").add();
				this.allowHTML = e;
				this.forExport = u;
				this.gradients = {};
				this.cache = {};
				this.cacheKeys = [];
				this.imgCount = 0;
				this.setSize(b, p, !1);
				var h;
				B && a.getBoundingClientRect && (b = function() {
					q(a, {
						left: 0,
						top: 0
					});
					h = a.getBoundingClientRect();
					q(a, {
						left: Math.ceil(h.left) - h.left + "px",
						top: Math.ceil(h.top) - h.top + "px"
					})
				}, b(), this.unSubPixelFix = x(R, "resize", b))
			},
			getStyle: function(a) {
				return this.style = e({
					fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
					fontSize: "12px"
				}, a)
			},
			setStyle: function(a) {
				this.boxWrapper.css(this.getStyle(a))
			},
			isHidden: function() {
				return !this.boxWrapper.getBBox().width
			},
			destroy: function() {
				var a = this.defs;
				this.box = null;
				this.boxWrapper = this.boxWrapper.destroy();
				r(this.gradients || {});
				this.gradients = null;
				a && (this.defs = a.destroy());
				this.unSubPixelFix && this.unSubPixelFix();
				return this.alignedObjects = null
			},
			createElement: function(a) {
				var b = new this.Element;
				b.init(this, a);
				return b
			},
			draw: G,
			getRadialAttr: function(a, b) {
				return {
					cx: a[0] - a[2] / 2 + b.cx * a[2],
					cy: a[1] - a[2] / 2 + b.cy * a[2],
					r: b.r * a[2]
				}
			},
			getSpanWidth: function(a, b) {
				var p = a.getBBox(!0).width;
				!M && this.forExport && (p = this.measureSpanWidth(b.firstChild.data, a.styles));
				return p
			},
			applyEllipsis: function(a, b, p, c) {
				var u = a.rotation,
					e = p,
					k, h = 0,
					g = p.length,
					A = function(a) {
						b.removeChild(b.firstChild);
						a && b.appendChild(m.createTextNode(a))
					},
					w;
				a.rotation = 0;
				e = this.getSpanWidth(a, b);
				if(w = e > c) {
					for(; h <= g;) k = Math.ceil((h + g) / 2), e = p.substring(0, k) + "\u2026", A(e), e = this.getSpanWidth(a, b), h === g ? h = g + 1 : e > c ? g = k - 1 : h = k;
					0 === g && A("")
				}
				a.rotation = u;
				return w
			},
			escapes: {
				"\x26": "\x26amp;",
				"\x3c": "\x26lt;",
				"\x3e": "\x26gt;",
				"'": "\x26#39;",
				'"': "\x26quot"
			},
			buildText: function(a) {
				var b = a.element,
					u = this,
					e = u.forExport,
					h = H(a.textStr, "").toString(),
					g = -1 !== h.indexOf("\x3c"),
					w = b.childNodes,
					A, l, L, G, r = d(b, "x"),
					f = a.styles,
					F = a.textWidth,
					B = f && f.lineHeight,
					D = f && f.textOutline,
					z = f && "ellipsis" === f.textOverflow,
					n = f && "nowrap" === f.whiteSpace,
					Q = f && f.fontSize,
					I, R, v = w.length,
					f = F && !a.added && this.box,
					J = function(a) {
						var c;
						c = /(px|em)$/.test(a && a.style.fontSize) ? a.style.fontSize : Q || u.style.fontSize || 12;
						return B ? p(B) : u.fontMetrics(c, a.getAttribute("style") ? a : b).h
					},
					t = function(a) {
						E(u.escapes, function(b, p) {
							a = a.replace(new RegExp(b, "g"), p)
						});
						return a
					};
				I = [h, z, n, B, D, Q, F].join();
				if(I !== a.textCache) {
					for(a.textCache =
						I; v--;) b.removeChild(w[v]);
					g || D || z || F || -1 !== h.indexOf(" ") ? (A = /<.*class="([^"]+)".*>/, l = /<.*style="([^"]+)".*>/, L = /<.*href="([^"]+)".*>/, f && f.appendChild(b), h = g ? h.replace(/<(b|strong)>/g, '\x3cspan style\x3d"font-weight:bold"\x3e').replace(/<(i|em)>/g, '\x3cspan style\x3d"font-style:italic"\x3e').replace(/<a/g, "\x3cspan").replace(/<\/(b|strong|i|em|a)>/g, "\x3c/span\x3e").split(/<br.*?>/g) : [h], h = c(h, function(a) {
						return "" !== a
					}), k(h, function(p, c) {
						var h, g = 0;
						p = p.replace(/^\s+|\s+$/g, "").replace(/<span/g,
							"|||\x3cspan").replace(/<\/span>/g, "\x3c/span\x3e|||");
						h = p.split("|||");
						k(h, function(p) {
							if("" !== p || 1 === h.length) {
								var k = {},
									w = m.createElementNS(u.SVG_NS, "tspan"),
									f, E;
								A.test(p) && (f = p.match(A)[1], d(w, "class", f));
								l.test(p) && (E = p.match(l)[1].replace(/(;| |^)color([ :])/, "$1fill$2"), d(w, "style", E));
								L.test(p) && !e && (d(w, "onclick", 'location.href\x3d"' + p.match(L)[1] + '"'), d(w, "class", "highcharts-anchor"), q(w, {
									cursor: "pointer"
								}));
								p = t(p.replace(/<[a-zA-Z\/](.|\n)*?>/g, "") || " ");
								if(" " !== p) {
									w.appendChild(m.createTextNode(p));
									g ? k.dx = 0 : c && null !== r && (k.x = r);
									d(w, k);
									b.appendChild(w);
									!g && R && (!M && e && q(w, {
										display: "block"
									}), d(w, "dy", J(w)));
									if(F) {
										k = p.replace(/([^\^])-/g, "$1- ").split(" ");
										f = 1 < h.length || c || 1 < k.length && !n;
										var B = [],
											D, P = J(w),
											Q = a.rotation;
										for(z && (G = u.applyEllipsis(a, w, p, F)); !z && f && (k.length || B.length);) a.rotation = 0, D = u.getSpanWidth(a, w), p = D > F, void 0 === G && (G = p), p && 1 !== k.length ? (w.removeChild(w.firstChild), B.unshift(k.pop())) : (k = B, B = [], k.length && !n && (w = m.createElementNS(O, "tspan"), d(w, {
												dy: P,
												x: r
											}), E && d(w, "style", E), b.appendChild(w)),
											D > F && (F = D)), k.length && w.appendChild(m.createTextNode(k.join(" ").replace(/- /g, "-")));
										a.rotation = Q
									}
									g++
								}
							}
						});
						R = R || b.childNodes.length
					}), G && a.attr("title", a.textStr), f && f.removeChild(b), D && a.applyTextOutline && a.applyTextOutline(D)) : b.appendChild(m.createTextNode(t(h)))
				}
			},
			getContrast: function(a) {
				a = t(a).rgba;
				return 510 < a[0] + a[1] + a[2] ? "#000000" : "#FFFFFF"
			},
			button: function(a, b, p, c, u, h, k, g, d) {
				var A = this.label(a, b, p, d, null, null, null, null, "button"),
					M = 0;
				A.attr(w({
					padding: 8,
					r: 2
				}, u));
				var l, m, L, G;
				u = w({
					fill: "#f7f7f7",
					stroke: "#cccccc",
					"stroke-width": 1,
					style: {
						color: "#333333",
						cursor: "pointer",
						fontWeight: "normal"
					}
				}, u);
				l = u.style;
				delete u.style;
				h = w(u, {
					fill: "#e6e6e6"
				}, h);
				m = h.style;
				delete h.style;
				k = w(u, {
					fill: "#e6ebf5",
					style: {
						color: "#000000",
						fontWeight: "bold"
					}
				}, k);
				L = k.style;
				delete k.style;
				g = w(u, {
					style: {
						color: "#cccccc"
					}
				}, g);
				G = g.style;
				delete g.style;
				x(A.element, J ? "mouseover" : "mouseenter", function() {
					3 !== M && A.setState(1)
				});
				x(A.element, J ? "mouseout" : "mouseleave", function() {
					3 !== M && A.setState(M)
				});
				A.setState = function(a) {
					1 !== a &&
						(A.state = M = a);
					A.removeClass(/highcharts-button-(normal|hover|pressed|disabled)/).addClass("highcharts-button-" + ["normal", "hover", "pressed", "disabled"][a || 0]);
					A.attr([u, h, k, g][a || 0]).css([l, m, L, G][a || 0])
				};
				A.attr(u).css(e({
					cursor: "default"
				}, l));
				return A.on("click", function(a) {
					3 !== M && c.call(A, a)
				})
			},
			crispLine: function(a, b) {
				a[1] === a[4] && (a[1] = a[4] = Math.round(a[1]) - b % 2 / 2);
				a[2] === a[5] && (a[2] = a[5] = Math.round(a[2]) + b % 2 / 2);
				return a
			},
			path: function(a) {
				var b = {
					fill: "none"
				};
				I(a) ? b.d = a : F(a) && e(b, a);
				return this.createElement("path").attr(b)
			},
			circle: function(a, b, p) {
				a = F(a) ? a : {
					x: a,
					y: b,
					r: p
				};
				b = this.createElement("circle");
				b.xSetter = b.ySetter = function(a, b, p) {
					p.setAttribute("c" + b, a)
				};
				return b.attr(a)
			},
			arc: function(a, b, p, c, u, e) {
				F(a) ? (c = a, b = c.y, p = c.r, a = c.x) : c = {
					innerR: c,
					start: u,
					end: e
				};
				a = this.symbol("arc", a, b, p, p, c);
				a.r = p;
				return a
			},
			rect: function(a, b, p, c, u, e) {
				u = F(a) ? a.r : u;
				var h = this.createElement("rect");
				a = F(a) ? a : void 0 === a ? {} : {
					x: a,
					y: b,
					width: Math.max(p, 0),
					height: Math.max(c, 0)
				};
				void 0 !== e && (a.strokeWidth = e, a = h.crisp(a));
				a.fill = "none";
				u && (a.r = u);
				h.rSetter =
					function(a, b, p) {
						d(p, {
							rx: a,
							ry: a
						})
					};
				return h.attr(a)
			},
			setSize: function(a, b, p) {
				var c = this.alignedObjects,
					u = c.length;
				this.width = a;
				this.height = b;
				for(this.boxWrapper.animate({
						width: a,
						height: b
					}, {
						step: function() {
							this.attr({
								viewBox: "0 0 " + this.attr("width") + " " + this.attr("height")
							})
						},
						duration: H(p, !0) ? void 0 : 0
					}); u--;) c[u].align()
			},
			g: function(a) {
				var b = this.createElement("g");
				return a ? b.attr({
					"class": "highcharts-" + a
				}) : b
			},
			image: function(a, b, p, c, u) {
				var h = {
					preserveAspectRatio: "none"
				};
				1 < arguments.length && e(h, {
					x: b,
					y: p,
					width: c,
					height: u
				});
				h = this.createElement("image").attr(h);
				h.element.setAttributeNS ? h.element.setAttributeNS("http://www.w3.org/1999/xlink", "href", a) : h.element.setAttribute("hc-svg-href", a);
				return h
			},
			symbol: function(a, b, p, c, u, h) {
				var w = this,
					g, d = /^url\((.*?)\)$/,
					M = d.test(a),
					A = !M && (this.symbols[a] ? a : "circle"),
					G = A && this.symbols[A],
					f = l(b) && G && G.call(this.symbols, Math.round(b), Math.round(p), c, u, h),
					r, E;
				G ? (g = this.path(f), g.attr("fill", "none"), e(g, {
					symbolName: A,
					x: b,
					y: p,
					width: c,
					height: u
				}), h && e(g, h)) : M && (r =
					a.match(d)[1], g = this.image(r), g.imgwidth = H(L[r] && L[r].width, h && h.width), g.imgheight = H(L[r] && L[r].height, h && h.height), E = function() {
						g.attr({
							width: g.width,
							height: g.height
						})
					}, k(["width", "height"], function(a) {
						g[a + "Setter"] = function(a, b) {
							var p = {},
								c = this["img" + b],
								u = "width" === b ? "translateX" : "translateY";
							this[b] = a;
							l(c) && (this.element && this.element.setAttribute(b, c), this.alignByTranslate || (p[u] = ((this[b] || 0) - c) / 2, this.attr(p)))
						}
					}), l(b) && g.attr({
						x: b,
						y: p
					}), g.isImg = !0, l(g.imgwidth) && l(g.imgheight) ? E() : (g.attr({
						width: 0,
						height: 0
					}), n("img", {
						onload: function() {
							var a = v[w.chartIndex];
							0 === this.width && (q(this, {
								position: "absolute",
								top: "-999em"
							}), m.body.appendChild(this));
							L[r] = {
								width: this.width,
								height: this.height
							};
							g.imgwidth = this.width;
							g.imgheight = this.height;
							g.element && E();
							this.parentNode && this.parentNode.removeChild(this);
							w.imgCount--;
							if(!w.imgCount && a && a.onload) a.onload()
						},
						src: r
					}), this.imgCount++));
				return g
			},
			symbols: {
				circle: function(a, b, p, c) {
					return this.arc(a + p / 2, b + c / 2, p / 2, c / 2, {
						start: 0,
						end: 2 * Math.PI,
						open: !1
					})
				},
				square: function(a,
					b, p, c) {
					return ["M", a, b, "L", a + p, b, a + p, b + c, a, b + c, "Z"]
				},
				triangle: function(a, b, p, c) {
					return ["M", a + p / 2, b, "L", a + p, b + c, a, b + c, "Z"]
				},
				"triangle-down": function(a, b, p, c) {
					return ["M", a, b, "L", a + p, b, a + p / 2, b + c, "Z"]
				},
				diamond: function(a, b, p, c) {
					return ["M", a + p / 2, b, "L", a + p, b + c / 2, a + p / 2, b + c, a, b + c / 2, "Z"]
				},
				arc: function(a, b, p, c, u) {
					var e = u.start,
						h = u.r || p,
						k = u.r || c || p,
						g = u.end - .001;
					p = u.innerR;
					c = H(u.open, .001 > Math.abs(u.end - u.start - 2 * Math.PI));
					var w = Math.cos(e),
						d = Math.sin(e),
						M = Math.cos(g),
						g = Math.sin(g);
					u = .001 > u.end - e - Math.PI ? 0 : 1;
					h = ["M", a + h * w, b + k * d, "A", h, k, 0, u, 1, a + h * M, b + k * g];
					l(p) && h.push(c ? "M" : "L", a + p * M, b + p * g, "A", p, p, 0, u, 0, a + p * w, b + p * d);
					h.push(c ? "" : "Z");
					return h
				},
				callout: function(a, b, p, c, u) {
					var e = Math.min(u && u.r || 0, p, c),
						h = e + 6,
						k = u && u.anchorX;
					u = u && u.anchorY;
					var g;
					g = ["M", a + e, b, "L", a + p - e, b, "C", a + p, b, a + p, b, a + p, b + e, "L", a + p, b + c - e, "C", a + p, b + c, a + p, b + c, a + p - e, b + c, "L", a + e, b + c, "C", a, b + c, a, b + c, a, b + c - e, "L", a, b + e, "C", a, b, a, b, a + e, b];
					k && k > p ? u > b + h && u < b + c - h ? g.splice(13, 3, "L", a + p, u - 6, a + p + 6, u, a + p, u + 6, a + p, b + c - e) : g.splice(13, 3, "L", a + p, c / 2, k, u, a + p,
						c / 2, a + p, b + c - e) : k && 0 > k ? u > b + h && u < b + c - h ? g.splice(33, 3, "L", a, u + 6, a - 6, u, a, u - 6, a, b + e) : g.splice(33, 3, "L", a, c / 2, k, u, a, c / 2, a, b + e) : u && u > c && k > a + h && k < a + p - h ? g.splice(23, 3, "L", k + 6, b + c, k, b + c + 6, k - 6, b + c, a + e, b + c) : u && 0 > u && k > a + h && k < a + p - h && g.splice(3, 3, "L", k - 6, b, k, b - 6, k + 6, b, p - e, b);
					return g
				}
			},
			clipRect: function(b, p, c, u) {
				var e = a.uniqueKey(),
					h = this.createElement("clipPath").attr({
						id: e
					}).add(this.defs);
				b = this.rect(b, p, c, u, 0).add(h);
				b.id = e;
				b.clipPath = h;
				b.count = 0;
				return b
			},
			text: function(a, b, p, c) {
				var u = {};
				if(c && (this.allowHTML ||
						!this.forExport)) return this.html(a, b, p);
				u.x = Math.round(b || 0);
				p && (u.y = Math.round(p));
				if(a || 0 === a) u.text = a;
				a = this.createElement("text").attr(u);
				c || (a.xSetter = function(a, b, p) {
					var c = p.getElementsByTagName("tspan"),
						u, e = p.getAttribute(b),
						h;
					for(h = 0; h < c.length; h++) u = c[h], u.getAttribute(b) === e && u.setAttribute(b, a);
					p.setAttribute(b, a)
				});
				return a
			},
			fontMetrics: function(a, b) {
				a = a || b && b.style && b.style.fontSize || this.style && this.style.fontSize;
				a = /px/.test(a) ? p(a) : /em/.test(a) ? parseFloat(a) * (b ? this.fontMetrics(null,
					b.parentNode).f : 16) : 12;
				b = 24 > a ? a + 3 : Math.round(1.2 * a);
				return {
					h: b,
					b: Math.round(.8 * b),
					f: a
				}
			},
			rotCorr: function(a, b, p) {
				var c = a;
				b && p && (c = Math.max(c * Math.cos(b * g), 4));
				return {
					x: -a / 3 * Math.sin(b * g),
					y: c
				}
			},
			label: function(b, p, c, h, g, d, M, m, L) {
				var G = this,
					f = G.g("button" !== L && "label"),
					r = f.text = G.text("", 0, 0, M).attr({
						zIndex: 1
					}),
					E, F, B = 0,
					D = 3,
					z = 0,
					A, Q, n, q, H, I = {},
					O, R, v = /^url\((.*?)\)$/.test(h),
					J = v,
					t, P, N, T;
				L && f.addClass("highcharts-" + L);
				J = v;
				t = function() {
					return(O || 0) % 2 / 2
				};
				P = function() {
					var a = r.element.style,
						b = {};
					F = (void 0 ===
						A || void 0 === Q || H) && l(r.textStr) && r.getBBox();
					f.width = (A || F.width || 0) + 2 * D + z;
					f.height = (Q || F.height || 0) + 2 * D;
					R = D + G.fontMetrics(a && a.fontSize, r).b;
					J && (E || (f.box = E = G.symbols[h] || v ? G.symbol(h) : G.rect(), E.addClass(("button" === L ? "" : "highcharts-label-box") + (L ? " highcharts-" + L + "-box" : "")), E.add(f), a = t(), b.x = a, b.y = (m ? -R : 0) + a), b.width = Math.round(f.width), b.height = Math.round(f.height), E.attr(e(b, I)), I = {})
				};
				N = function() {
					var a = z + D,
						b;
					b = m ? 0 : R;
					l(A) && F && ("center" === H || "right" === H) && (a += {
						center: .5,
						right: 1
					}[H] * (A - F.width));
					if(a !== r.x || b !== r.y) r.attr("x", a), void 0 !== b && r.attr("y", b);
					r.x = a;
					r.y = b
				};
				T = function(a, b) {
					E ? E.attr(a, b) : I[a] = b
				};
				f.onAdd = function() {
					r.add(f);
					f.attr({
						text: b || 0 === b ? b : "",
						x: p,
						y: c
					});
					E && l(g) && f.attr({
						anchorX: g,
						anchorY: d
					})
				};
				f.widthSetter = function(b) {
					A = a.isNumber(b) ? b : null
				};
				f.heightSetter = function(a) {
					Q = a
				};
				f["text-alignSetter"] = function(a) {
					H = a
				};
				f.paddingSetter = function(a) {
					l(a) && a !== D && (D = f.padding = a, N())
				};
				f.paddingLeftSetter = function(a) {
					l(a) && a !== z && (z = a, N())
				};
				f.alignSetter = function(a) {
					a = {
						left: 0,
						center: .5,
						right: 1
					}[a];
					a !== B && (B = a, F && f.attr({
						x: n
					}))
				};
				f.textSetter = function(a) {
					void 0 !== a && r.textSetter(a);
					P();
					N()
				};
				f["stroke-widthSetter"] = function(a, b) {
					a && (J = !0);
					O = this["stroke-width"] = a;
					T(b, a)
				};
				f.strokeSetter = f.fillSetter = f.rSetter = function(a, b) {
					"r" !== b && ("fill" === b && a && (J = !0), f[b] = a);
					T(b, a)
				};
				f.anchorXSetter = function(a, b) {
					g = f.anchorX = a;
					T(b, Math.round(a) - t() - n)
				};
				f.anchorYSetter = function(a, b) {
					d = f.anchorY = a;
					T(b, a - q)
				};
				f.xSetter = function(a) {
					f.x = a;
					B && (a -= B * ((A || F.width) + 2 * D));
					n = Math.round(a);
					f.attr("translateX",
						n)
				};
				f.ySetter = function(a) {
					q = f.y = Math.round(a);
					f.attr("translateY", q)
				};
				var U = f.css;
				return e(f, {
					css: function(a) {
						if(a) {
							var b = {};
							a = w(a);
							k(f.textProps, function(p) {
								void 0 !== a[p] && (b[p] = a[p], delete a[p])
							});
							r.css(b)
						}
						return U.call(f, a)
					},
					getBBox: function() {
						return {
							width: F.width + 2 * D,
							height: F.height + 2 * D,
							x: F.x - D,
							y: F.y - D
						}
					},
					shadow: function(a) {
						a && (P(), E && E.shadow(a));
						return f
					},
					destroy: function() {
						u(f.element, "mouseenter");
						u(f.element, "mouseleave");
						r && (r = r.destroy());
						E && (E = E.destroy());
						y.prototype.destroy.call(f);
						f =
							G = P = N = T = null
					}
				})
			}
		});
		a.Renderer = C
	})(K);
	(function(a) {
		var y = a.attr,
			C = a.createElement,
			x = a.css,
			f = a.defined,
			d = a.each,
			v = a.extend,
			t = a.isFirefox,
			q = a.isMS,
			n = a.isWebKit,
			l = a.pick,
			g = a.pInt,
			r = a.SVGRenderer,
			m = a.win,
			k = a.wrap;
		v(a.SVGElement.prototype, {
			htmlCss: function(a) {
				var b = this.element;
				if(b = a && "SPAN" === b.tagName && a.width) delete a.width, this.textWidth = b, this.updateTransform();
				a && "ellipsis" === a.textOverflow && (a.whiteSpace = "nowrap", a.overflow = "hidden");
				this.styles = v(this.styles, a);
				x(this.element, a);
				return this
			},
			htmlGetBBox: function() {
				var a =
					this.element;
				return {
					x: a.offsetLeft,
					y: a.offsetTop,
					width: a.offsetWidth,
					height: a.offsetHeight
				}
			},
			htmlUpdateTransform: function() {
				if(this.added) {
					var a = this.renderer,
						b = this.element,
						c = this.translateX || 0,
						h = this.translateY || 0,
						k = this.x || 0,
						l = this.y || 0,
						m = this.textAlign || "left",
						r = {
							left: 0,
							center: .5,
							right: 1
						}[m],
						F = this.styles;
					x(b, {
						marginLeft: c,
						marginTop: h
					});
					this.shadows && d(this.shadows, function(a) {
						x(a, {
							marginLeft: c + 1,
							marginTop: h + 1
						})
					});
					this.inverted && d(b.childNodes, function(c) {
						a.invertChild(c, b)
					});
					if("SPAN" === b.tagName) {
						var z =
							this.rotation,
							q = g(this.textWidth),
							w = F && F.whiteSpace,
							G = [z, m, b.innerHTML, this.textWidth, this.textAlign].join();
						G !== this.cTT && (F = a.fontMetrics(b.style.fontSize).b, f(z) && this.setSpanRotation(z, r, F), x(b, {
							width: "",
							whiteSpace: w || "nowrap"
						}), b.offsetWidth > q && /[ \-]/.test(b.textContent || b.innerText) && x(b, {
							width: q + "px",
							display: "block",
							whiteSpace: w || "normal"
						}), this.getSpanCorrection(b.offsetWidth, F, r, z, m));
						x(b, {
							left: k + (this.xCorr || 0) + "px",
							top: l + (this.yCorr || 0) + "px"
						});
						n && (F = b.offsetHeight);
						this.cTT = G
					}
				} else this.alignOnAdd = !0
			},
			setSpanRotation: function(a, b, c) {
				var h = {},
					e = this.renderer.getTransformKey();
				h[e] = h.transform = "rotate(" + a + "deg)";
				h[e + (t ? "Origin" : "-origin")] = h.transformOrigin = 100 * b + "% " + c + "px";
				x(this.element, h)
			},
			getSpanCorrection: function(a, b, c) {
				this.xCorr = -a * c;
				this.yCorr = -b
			}
		});
		v(r.prototype, {
			getTransformKey: function() {
				return q && !/Edge/.test(m.navigator.userAgent) ? "-ms-transform" : n ? "-webkit-transform" : t ? "MozTransform" : m.opera ? "-o-transform" : ""
			},
			html: function(a, b, c) {
				var h = this.createElement("span"),
					e = h.element,
					g = h.renderer,
					f = g.isSVG,
					m = function(a, b) {
						d(["opacity", "visibility"], function(c) {
							k(a, c + "Setter", function(a, c, h, e) {
								a.call(this, c, h, e);
								b[h] = c
							})
						})
					};
				h.textSetter = function(a) {
					a !== e.innerHTML && delete this.bBox;
					this.textStr = a;
					e.innerHTML = l(a, "");
					h.htmlUpdateTransform()
				};
				f && m(h, h.element.style);
				h.xSetter = h.ySetter = h.alignSetter = h.rotationSetter = function(a, b) {
					"align" === b && (b = "textAlign");
					h[b] = a;
					h.htmlUpdateTransform()
				};
				h.attr({
					text: a,
					x: Math.round(b),
					y: Math.round(c)
				}).css({
					fontFamily: this.style.fontFamily,
					fontSize: this.style.fontSize,
					position: "absolute"
				});
				e.style.whiteSpace = "nowrap";
				h.css = h.htmlCss;
				f && (h.add = function(a) {
					var b, c = g.box.parentNode,
						k = [];
					if(this.parentGroup = a) {
						if(b = a.div, !b) {
							for(; a;) k.push(a), a = a.parentGroup;
							d(k.reverse(), function(a) {
								function e(b, p) {
									a[p] = b;
									q ? w[g.getTransformKey()] = "translate(" + (a.x || a.translateX) + "px," + (a.y || a.translateY) + "px)" : "translateX" === p ? w.left = b + "px" : w.top = b + "px";
									a.doTransform = !0
								}
								var w, p = y(a.element, "class");
								p && (p = {
									className: p
								});
								b = a.div = a.div || C("div", p, {
									position: "absolute",
									left: (a.translateX ||
										0) + "px",
									top: (a.translateY || 0) + "px",
									display: a.display,
									opacity: a.opacity,
									pointerEvents: a.styles && a.styles.pointerEvents
								}, b || c);
								w = b.style;
								v(a, {
									classSetter: function(a) {
										this.element.setAttribute("class", a);
										b.className = a
									},
									on: function() {
										k[0].div && h.on.apply({
											element: k[0].div
										}, arguments);
										return a
									},
									translateXSetter: e,
									translateYSetter: e
								});
								m(a, w)
							})
						}
					} else b = c;
					b.appendChild(e);
					h.added = !0;
					h.alignOnAdd && h.htmlUpdateTransform();
					return h
				});
				return h
			}
		})
	})(K);
	(function(a) {
		var y = a.correctFloat,
			C = a.defined,
			x = a.destroyObjectProperties,
			f = a.isNumber,
			d = a.merge,
			v = a.pick,
			t = a.deg2rad;
		a.Tick = function(a, d, f, g) {
			this.axis = a;
			this.pos = d;
			this.type = f || "";
			this.isNewLabel = this.isNew = !0;
			f || g || this.addLabel()
		};
		a.Tick.prototype = {
			addLabel: function() {
				var a = this.axis,
					f = a.options,
					l = a.chart,
					g = a.categories,
					r = a.names,
					m = this.pos,
					k = f.labels,
					e = a.tickPositions,
					b = m === e[0],
					c = m === e[e.length - 1],
					r = g ? v(g[m], r[m], m) : m,
					g = this.label,
					e = e.info,
					h;
				a.isDatetimeAxis && e && (h = f.dateTimeLabelFormats[e.higherRanks[m] || e.unitName]);
				this.isFirst = b;
				this.isLast = c;
				f = a.labelFormatter.call({
					axis: a,
					chart: l,
					isFirst: b,
					isLast: c,
					dateTimeLabelFormat: h,
					value: a.isLog ? y(a.lin2log(r)) : r,
					pos: m
				});
				C(g) ? g && g.attr({
					text: f
				}) : (this.labelLength = (this.label = g = C(f) && k.enabled ? l.renderer.text(f, 0, 0, k.useHTML).css(d(k.style)).add(a.labelGroup) : null) && g.getBBox().width, this.rotation = 0)
			},
			getLabelSize: function() {
				return this.label ? this.label.getBBox()[this.axis.horiz ? "height" : "width"] : 0
			},
			handleOverflow: function(a) {
				var f = this.axis,
					d = a.x,
					g = f.chart.chartWidth,
					r = f.chart.spacing,
					m = v(f.labelLeft, Math.min(f.pos, r[3])),
					r = v(f.labelRight,
						Math.max(f.pos + f.len, g - r[1])),
					k = this.label,
					e = this.rotation,
					b = {
						left: 0,
						center: .5,
						right: 1
					}[f.labelAlign],
					c = k.getBBox().width,
					h = f.getSlotWidth(),
					D = h,
					q = 1,
					B, J = {};
				if(e) 0 > e && d - b * c < m ? B = Math.round(d / Math.cos(e * t) - m) : 0 < e && d + b * c > r && (B = Math.round((g - d) / Math.cos(e * t)));
				else if(g = d + (1 - b) * c, d - b * c < m ? D = a.x + D * (1 - b) - m : g > r && (D = r - a.x + D * b, q = -1), D = Math.min(h, D), D < h && "center" === f.labelAlign && (a.x += q * (h - D - b * (h - Math.min(c, D)))), c > D || f.autoRotation && (k.styles || {}).width) B = D;
				B && (J.width = B, (f.options.labels.style || {}).textOverflow ||
					(J.textOverflow = "ellipsis"), k.css(J))
			},
			getPosition: function(a, f, d, g) {
				var l = this.axis,
					m = l.chart,
					k = g && m.oldChartHeight || m.chartHeight;
				return {
					x: a ? l.translate(f + d, null, null, g) + l.transB : l.left + l.offset + (l.opposite ? (g && m.oldChartWidth || m.chartWidth) - l.right - l.left : 0),
					y: a ? k - l.bottom + l.offset - (l.opposite ? l.height : 0) : k - l.translate(f + d, null, null, g) - l.transB
				}
			},
			getLabelPosition: function(a, f, d, g, r, m, k, e) {
				var b = this.axis,
					c = b.transA,
					h = b.reversed,
					l = b.staggerLines,
					n = b.tickRotCorr || {
						x: 0,
						y: 0
					},
					B = r.y;
				C(B) || (B = 0 === b.side ?
					d.rotation ? -8 : -d.getBBox().height : 2 === b.side ? n.y + 8 : Math.cos(d.rotation * t) * (n.y - d.getBBox(!1, 0).height / 2));
				a = a + r.x + n.x - (m && g ? m * c * (h ? -1 : 1) : 0);
				f = f + B - (m && !g ? m * c * (h ? 1 : -1) : 0);
				l && (d = k / (e || 1) % l, b.opposite && (d = l - d - 1), f += b.labelOffset / l * d);
				return {
					x: a,
					y: Math.round(f)
				}
			},
			getMarkPath: function(a, f, d, g, r, m) {
				return m.crispLine(["M", a, f, "L", a + (r ? 0 : -d), f + (r ? d : 0)], g)
			},
			renderGridLine: function(a, f, d) {
				var g = this.axis,
					l = g.options,
					m = this.gridLine,
					k = {},
					e = this.pos,
					b = this.type,
					c = g.tickmarkOffset,
					h = g.chart.renderer,
					D = b ? b + "Grid" :
					"grid",
					n = l[D + "LineWidth"],
					B = l[D + "LineColor"],
					l = l[D + "LineDashStyle"];
				m || (k.stroke = B, k["stroke-width"] = n, l && (k.dashstyle = l), b || (k.zIndex = 1), a && (k.opacity = 0), this.gridLine = m = h.path().attr(k).addClass("highcharts-" + (b ? b + "-" : "") + "grid-line").add(g.gridGroup));
				if(!a && m && (a = g.getPlotLinePath(e + c, m.strokeWidth() * d, a, !0))) m[this.isNew ? "attr" : "animate"]({
					d: a,
					opacity: f
				})
			},
			renderMark: function(a, f, d) {
				var g = this.axis,
					l = g.options,
					m = g.chart.renderer,
					k = this.type,
					e = k ? k + "Tick" : "tick",
					b = g.tickSize(e),
					c = this.mark,
					h = !c,
					D = a.x;
				a = a.y;
				var n = v(l[e + "Width"], !k && g.isXAxis ? 1 : 0),
					l = l[e + "Color"];
				b && (g.opposite && (b[0] = -b[0]), h && (this.mark = c = m.path().addClass("highcharts-" + (k ? k + "-" : "") + "tick").add(g.axisGroup), c.attr({
					stroke: l,
					"stroke-width": n
				})), c[h ? "attr" : "animate"]({
					d: this.getMarkPath(D, a, b[0], c.strokeWidth() * d, g.horiz, m),
					opacity: f
				}))
			},
			renderLabel: function(a, d, l, g) {
				var r = this.axis,
					m = r.horiz,
					k = r.options,
					e = this.label,
					b = k.labels,
					c = b.step,
					h = r.tickmarkOffset,
					D = !0,
					n = a.x;
				a = a.y;
				e && f(n) && (e.xy = a = this.getLabelPosition(n, a, e, m, b, h,
					g, c), this.isFirst && !this.isLast && !v(k.showFirstLabel, 1) || this.isLast && !this.isFirst && !v(k.showLastLabel, 1) ? D = !1 : !m || r.isRadial || b.step || b.rotation || d || 0 === l || this.handleOverflow(a), c && g % c && (D = !1), D && f(a.y) ? (a.opacity = l, e[this.isNewLabel ? "attr" : "animate"](a), this.isNewLabel = !1) : (e.attr("y", -9999), this.isNewLabel = !0))
			},
			render: function(a, f, d) {
				var g = this.axis,
					l = g.horiz,
					m = this.getPosition(l, this.pos, g.tickmarkOffset, f),
					k = m.x,
					e = m.y,
					g = l && k === g.pos + g.len || !l && e === g.pos ? -1 : 1;
				d = v(d, 1);
				this.isActive = !0;
				this.renderGridLine(f,
					d, g);
				this.renderMark(m, d, g);
				this.renderLabel(m, f, d, a);
				this.isNew = !1
			},
			destroy: function() {
				x(this, this.axis)
			}
		}
	})(K);
	var V = function(a) {
		var y = a.addEvent,
			C = a.animObject,
			x = a.arrayMax,
			f = a.arrayMin,
			d = a.color,
			v = a.correctFloat,
			t = a.defaultOptions,
			q = a.defined,
			n = a.deg2rad,
			l = a.destroyObjectProperties,
			g = a.each,
			r = a.extend,
			m = a.fireEvent,
			k = a.format,
			e = a.getMagnitude,
			b = a.grep,
			c = a.inArray,
			h = a.isArray,
			D = a.isNumber,
			I = a.isString,
			B = a.merge,
			J = a.normalizeTickInterval,
			F = a.objectEach,
			z = a.pick,
			N = a.removeEvent,
			w = a.splat,
			G = a.syncTimeout,
			E = a.Tick,
			H = function() {
				this.init.apply(this, arguments)
			};
		a.extend(H.prototype, {
			defaultOptions: {
				dateTimeLabelFormats: {
					millisecond: "%H:%M:%S.%L",
					second: "%H:%M:%S",
					minute: "%H:%M",
					hour: "%H:%M",
					day: "%e. %b",
					week: "%e. %b",
					month: "%b '%y",
					year: "%Y"
				},
				endOnTick: !1,
				labels: {
					enabled: !0,
					style: {
						color: "#666666",
						cursor: "default",
						fontSize: "11px"
					},
					x: 0
				},
				maxPadding: .01,
				minorTickLength: 2,
				minorTickPosition: "outside",
				minPadding: .01,
				startOfWeek: 1,
				startOnTick: !1,
				tickLength: 10,
				tickmarkPlacement: "between",
				tickPixelInterval: 100,
				tickPosition: "outside",
				title: {
					align: "middle",
					style: {
						color: "#666666"
					}
				},
				type: "linear",
				minorGridLineColor: "#f2f2f2",
				minorGridLineWidth: 1,
				minorTickColor: "#999999",
				lineColor: "#ccd6eb",
				lineWidth: 1,
				gridLineColor: "#e6e6e6",
				tickColor: "#ccd6eb"
			},
			defaultYAxisOptions: {
				endOnTick: !0,
				tickPixelInterval: 72,
				showLastLabel: !0,
				labels: {
					x: -8
				},
				maxPadding: .05,
				minPadding: .05,
				startOnTick: !0,
				title: {
					rotation: 270,
					text: "Values"
				},
				stackLabels: {
					allowOverlap: !1,
					enabled: !1,
					formatter: function() {
						return a.numberFormat(this.total, -1)
					},
					style: {
						fontSize: "11px",
						fontWeight: "bold",
						color: "#000000",
						textOutline: "1px contrast"
					}
				},
				gridLineWidth: 1,
				lineWidth: 0
			},
			defaultLeftAxisOptions: {
				labels: {
					x: -15
				},
				title: {
					rotation: 270
				}
			},
			defaultRightAxisOptions: {
				labels: {
					x: 15
				},
				title: {
					rotation: 90
				}
			},
			defaultBottomAxisOptions: {
				labels: {
					autoRotation: [-45],
					x: 0
				},
				title: {
					rotation: 0
				}
			},
			defaultTopAxisOptions: {
				labels: {
					autoRotation: [-45],
					x: 0
				},
				title: {
					rotation: 0
				}
			},
			init: function(a, b) {
				var p = b.isX,
					u = this;
				u.chart = a;
				u.horiz = a.inverted && !u.isZAxis ? !p : p;
				u.isXAxis = p;
				u.coll = u.coll || (p ?
					"xAxis" : "yAxis");
				u.opposite = b.opposite;
				u.side = b.side || (u.horiz ? u.opposite ? 0 : 2 : u.opposite ? 1 : 3);
				u.setOptions(b);
				var h = this.options,
					e = h.type;
				u.labelFormatter = h.labels.formatter || u.defaultLabelFormatter;
				u.userOptions = b;
				u.minPixelPadding = 0;
				u.reversed = h.reversed;
				u.visible = !1 !== h.visible;
				u.zoomEnabled = !1 !== h.zoomEnabled;
				u.hasNames = "category" === e || !0 === h.categories;
				u.categories = h.categories || u.hasNames;
				u.names = u.names || [];
				u.plotLinesAndBandsGroups = {};
				u.isLog = "logarithmic" === e;
				u.isDatetimeAxis = "datetime" ===
					e;
				u.positiveValuesOnly = u.isLog && !u.allowNegativeLog;
				u.isLinked = q(h.linkedTo);
				u.ticks = {};
				u.labelEdge = [];
				u.minorTicks = {};
				u.plotLinesAndBands = [];
				u.alternateBands = {};
				u.len = 0;
				u.minRange = u.userMinRange = h.minRange || h.maxZoom;
				u.range = h.range;
				u.offset = h.offset || 0;
				u.stacks = {};
				u.oldStacks = {};
				u.stacksTouched = 0;
				u.max = null;
				u.min = null;
				u.crosshair = z(h.crosshair, w(a.options.tooltip.crosshairs)[p ? 0 : 1], !1);
				b = u.options.events; - 1 === c(u, a.axes) && (p ? a.axes.splice(a.xAxis.length, 0, u) : a.axes.push(u), a[u.coll].push(u));
				u.series =
					u.series || [];
				a.inverted && !u.isZAxis && p && void 0 === u.reversed && (u.reversed = !0);
				F(b, function(a, b) {
					y(u, b, a)
				});
				u.lin2log = h.linearToLogConverter || u.lin2log;
				u.isLog && (u.val2lin = u.log2lin, u.lin2val = u.lin2log)
			},
			setOptions: function(a) {
				this.options = B(this.defaultOptions, "yAxis" === this.coll && this.defaultYAxisOptions, [this.defaultTopAxisOptions, this.defaultRightAxisOptions, this.defaultBottomAxisOptions, this.defaultLeftAxisOptions][this.side], B(t[this.coll], a))
			},
			defaultLabelFormatter: function() {
				var b = this.axis,
					u = this.value,
					c = b.categories,
					h = this.dateTimeLabelFormat,
					e = t.lang,
					g = e.numericSymbols,
					e = e.numericSymbolMagnitude || 1E3,
					w = g && g.length,
					d, f = b.options.labels.format,
					b = b.isLog ? Math.abs(u) : b.tickInterval;
				if(f) d = k(f, this);
				else if(c) d = u;
				else if(h) d = a.dateFormat(h, u);
				else if(w && 1E3 <= b)
					for(; w-- && void 0 === d;) c = Math.pow(e, w + 1), b >= c && 0 === 10 * u % c && null !== g[w] && 0 !== u && (d = a.numberFormat(u / c, -1) + g[w]);
				void 0 === d && (d = 1E4 <= Math.abs(u) ? a.numberFormat(u, -1) : a.numberFormat(u, -1, void 0, ""));
				return d
			},
			getSeriesExtremes: function() {
				var a =
					this,
					c = a.chart;
				a.hasVisibleSeries = !1;
				a.dataMin = a.dataMax = a.threshold = null;
				a.softThreshold = !a.isXAxis;
				a.buildStacks && a.buildStacks();
				g(a.series, function(p) {
					if(p.visible || !c.options.chart.ignoreHiddenSeries) {
						var u = p.options,
							h = u.threshold,
							e;
						a.hasVisibleSeries = !0;
						a.positiveValuesOnly && 0 >= h && (h = null);
						if(a.isXAxis) u = p.xData, u.length && (p = f(u), e = x(u), D(p) || p instanceof Date || (u = b(u, D), p = f(u)), a.dataMin = Math.min(z(a.dataMin, u[0], p), p), a.dataMax = Math.max(z(a.dataMax, u[0], e), e));
						else if(p.getExtremes(), e = p.dataMax,
							p = p.dataMin, q(p) && q(e) && (a.dataMin = Math.min(z(a.dataMin, p), p), a.dataMax = Math.max(z(a.dataMax, e), e)), q(h) && (a.threshold = h), !u.softThreshold || a.positiveValuesOnly) a.softThreshold = !1
					}
				})
			},
			translate: function(a, b, c, h, e, k) {
				var p = this.linkedParent || this,
					u = 1,
					g = 0,
					w = h ? p.oldTransA : p.transA;
				h = h ? p.oldMin : p.min;
				var d = p.minPixelPadding;
				e = (p.isOrdinal || p.isBroken || p.isLog && e) && p.lin2val;
				w || (w = p.transA);
				c && (u *= -1, g = p.len);
				p.reversed && (u *= -1, g -= u * (p.sector || p.len));
				b ? (a = (a * u + g - d) / w + h, e && (a = p.lin2val(a))) : (e && (a = p.val2lin(a)),
					a = D(h) ? u * (a - h) * w + g + u * d + (D(k) ? w * k : 0) : void 0);
				return a
			},
			toPixels: function(a, b) {
				return this.translate(a, !1, !this.horiz, null, !0) + (b ? 0 : this.pos)
			},
			toValue: function(a, b) {
				return this.translate(a - (b ? 0 : this.pos), !0, !this.horiz, null, !0)
			},
			getPlotLinePath: function(a, b, c, h, e) {
				var p = this.chart,
					u = this.left,
					k = this.top,
					g, w, d = c && p.oldChartHeight || p.chartHeight,
					f = c && p.oldChartWidth || p.chartWidth,
					l;
				g = this.transB;
				var m = function(a, b, p) {
					if(a < b || a > p) h ? a = Math.min(Math.max(b, a), p) : l = !0;
					return a
				};
				e = z(e, this.translate(a, null,
					null, c));
				a = c = Math.round(e + g);
				g = w = Math.round(d - e - g);
				D(e) ? this.horiz ? (g = k, w = d - this.bottom, a = c = m(a, u, u + this.width)) : (a = u, c = f - this.right, g = w = m(g, k, k + this.height)) : (l = !0, h = !1);
				return l && !h ? null : p.renderer.crispLine(["M", a, g, "L", c, w], b || 1)
			},
			getLinearTickPositions: function(a, b, c) {
				var p, u = v(Math.floor(b / a) * a);
				c = v(Math.ceil(c / a) * a);
				var h = [],
					e;
				v(u + a) === u && (e = 20);
				if(this.single) return [b];
				for(b = u; b <= c;) {
					h.push(b);
					b = v(b + a, e);
					if(b === p) break;
					p = b
				}
				return h
			},
			getMinorTickInterval: function() {
				var a = this.options;
				return !0 ===
					a.minorTicks ? z(a.minorTickInterval, "auto") : !1 === a.minorTicks ? null : a.minorTickInterval
			},
			getMinorTickPositions: function() {
				var a = this,
					b = a.options,
					c = a.tickPositions,
					h = a.minorTickInterval,
					e = [],
					k = a.pointRangePadding || 0,
					w = a.min - k,
					k = a.max + k,
					d = k - w;
				if(d && d / h < a.len / 3)
					if(a.isLog) g(this.paddedTicks, function(b, p, c) {
						p && e.push.apply(e, a.getLogTickPositions(h, c[p - 1], c[p], !0))
					});
					else if(a.isDatetimeAxis && "auto" === this.getMinorTickInterval()) e = e.concat(a.getTimeTicks(a.normalizeTimeTickInterval(h), w, k, b.startOfWeek));
				else
					for(b = w + (c[0] - w) % h; b <= k && b !== e[0]; b += h) e.push(b);
				0 !== e.length && a.trimTicks(e);
				return e
			},
			adjustForMinRange: function() {
				var a = this.options,
					b = this.min,
					c = this.max,
					h, e, k, w, d, l, m, G;
				this.isXAxis && void 0 === this.minRange && !this.isLog && (q(a.min) || q(a.max) ? this.minRange = null : (g(this.series, function(a) {
					l = a.xData;
					for(w = m = a.xIncrement ? 1 : l.length - 1; 0 < w; w--)
						if(d = l[w] - l[w - 1], void 0 === k || d < k) k = d
				}), this.minRange = Math.min(5 * k, this.dataMax - this.dataMin)));
				c - b < this.minRange && (e = this.dataMax - this.dataMin >= this.minRange,
					G = this.minRange, h = (G - c + b) / 2, h = [b - h, z(a.min, b - h)], e && (h[2] = this.isLog ? this.log2lin(this.dataMin) : this.dataMin), b = x(h), c = [b + G, z(a.max, b + G)], e && (c[2] = this.isLog ? this.log2lin(this.dataMax) : this.dataMax), c = f(c), c - b < G && (h[0] = c - G, h[1] = z(a.min, c - G), b = x(h)));
				this.min = b;
				this.max = c
			},
			getClosest: function() {
				var a;
				this.categories ? a = 1 : g(this.series, function(b) {
					var c = b.closestPointRange,
						p = b.visible || !b.chart.options.chart.ignoreHiddenSeries;
					!b.noSharedTooltip && q(c) && p && (a = q(a) ? Math.min(a, c) : c)
				});
				return a
			},
			nameToX: function(a) {
				var b =
					h(this.categories),
					p = b ? this.categories : this.names,
					e = a.options.x,
					k;
				a.series.requireSorting = !1;
				q(e) || (e = !1 === this.options.uniqueNames ? a.series.autoIncrement() : c(a.name, p)); - 1 === e ? b || (k = p.length) : k = e;
				void 0 !== k && (this.names[k] = a.name);
				return k
			},
			updateNames: function() {
				var a = this;
				0 < this.names.length && (this.names.length = 0, this.minRange = this.userMinRange, g(this.series || [], function(b) {
					b.xIncrement = null;
					if(!b.points || b.isDirtyData) b.processData(), b.generatePoints();
					g(b.points, function(c, p) {
						var u;
						c.options &&
							(u = a.nameToX(c), void 0 !== u && u !== c.x && (c.x = u, b.xData[p] = u))
					})
				}))
			},
			setAxisTranslation: function(a) {
				var b = this,
					c = b.max - b.min,
					p = b.axisPointRange || 0,
					h, e = 0,
					k = 0,
					w = b.linkedParent,
					d = !!b.categories,
					f = b.transA,
					l = b.isXAxis;
				if(l || d || p) h = b.getClosest(), w ? (e = w.minPointOffset, k = w.pointRangePadding) : g(b.series, function(a) {
						var c = d ? 1 : l ? z(a.options.pointRange, h, 0) : b.axisPointRange || 0;
						a = a.options.pointPlacement;
						p = Math.max(p, c);
						b.single || (e = Math.max(e, I(a) ? 0 : c / 2), k = Math.max(k, "on" === a ? 0 : c))
					}), w = b.ordinalSlope && h ? b.ordinalSlope /
					h : 1, b.minPointOffset = e *= w, b.pointRangePadding = k *= w, b.pointRange = Math.min(p, c), l && (b.closestPointRange = h);
				a && (b.oldTransA = f);
				b.translationSlope = b.transA = f = b.options.staticScale || b.len / (c + k || 1);
				b.transB = b.horiz ? b.left : b.bottom;
				b.minPixelPadding = f * e
			},
			minFromRange: function() {
				return this.max - this.range
			},
			setTickInterval: function(b) {
				var c = this,
					p = c.chart,
					h = c.options,
					k = c.isLog,
					w = c.log2lin,
					d = c.isDatetimeAxis,
					f = c.isXAxis,
					l = c.isLinked,
					G = h.maxPadding,
					E = h.minPadding,
					r = h.tickInterval,
					F = h.tickPixelInterval,
					B = c.categories,
					n = c.threshold,
					H = c.softThreshold,
					I, t, N, x;
				d || B || l || this.getTickAmount();
				N = z(c.userMin, h.min);
				x = z(c.userMax, h.max);
				l ? (c.linkedParent = p[c.coll][h.linkedTo], p = c.linkedParent.getExtremes(), c.min = z(p.min, p.dataMin), c.max = z(p.max, p.dataMax), h.type !== c.linkedParent.options.type && a.error(11, 1)) : (!H && q(n) && (c.dataMin >= n ? (I = n, E = 0) : c.dataMax <= n && (t = n, G = 0)), c.min = z(N, I, c.dataMin), c.max = z(x, t, c.dataMax));
				k && (c.positiveValuesOnly && !b && 0 >= Math.min(c.min, z(c.dataMin, c.min)) && a.error(10, 1), c.min = v(w(c.min), 15), c.max =
					v(w(c.max), 15));
				c.range && q(c.max) && (c.userMin = c.min = N = Math.max(c.dataMin, c.minFromRange()), c.userMax = x = c.max, c.range = null);
				m(c, "foundExtremes");
				c.beforePadding && c.beforePadding();
				c.adjustForMinRange();
				!(B || c.axisPointRange || c.usePercentage || l) && q(c.min) && q(c.max) && (w = c.max - c.min) && (!q(N) && E && (c.min -= w * E), !q(x) && G && (c.max += w * G));
				D(h.softMin) && (c.min = Math.min(c.min, h.softMin));
				D(h.softMax) && (c.max = Math.max(c.max, h.softMax));
				D(h.floor) && (c.min = Math.max(c.min, h.floor));
				D(h.ceiling) && (c.max = Math.min(c.max,
					h.ceiling));
				H && q(c.dataMin) && (n = n || 0, !q(N) && c.min < n && c.dataMin >= n ? c.min = n : !q(x) && c.max > n && c.dataMax <= n && (c.max = n));
				c.tickInterval = c.min === c.max || void 0 === c.min || void 0 === c.max ? 1 : l && !r && F === c.linkedParent.options.tickPixelInterval ? r = c.linkedParent.tickInterval : z(r, this.tickAmount ? (c.max - c.min) / Math.max(this.tickAmount - 1, 1) : void 0, B ? 1 : (c.max - c.min) * F / Math.max(c.len, F));
				f && !b && g(c.series, function(a) {
					a.processData(c.min !== c.oldMin || c.max !== c.oldMax)
				});
				c.setAxisTranslation(!0);
				c.beforeSetTickPositions &&
					c.beforeSetTickPositions();
				c.postProcessTickInterval && (c.tickInterval = c.postProcessTickInterval(c.tickInterval));
				c.pointRange && !r && (c.tickInterval = Math.max(c.pointRange, c.tickInterval));
				b = z(h.minTickInterval, c.isDatetimeAxis && c.closestPointRange);
				!r && c.tickInterval < b && (c.tickInterval = b);
				d || k || r || (c.tickInterval = J(c.tickInterval, null, e(c.tickInterval), z(h.allowDecimals, !(.5 < c.tickInterval && 5 > c.tickInterval && 1E3 < c.max && 9999 > c.max)), !!this.tickAmount));
				this.tickAmount || (c.tickInterval = c.unsquish());
				this.setTickPositions()
			},
			setTickPositions: function() {
				var a = this.options,
					b, c = a.tickPositions;
				b = this.getMinorTickInterval();
				var h = a.tickPositioner,
					e = a.startOnTick,
					k = a.endOnTick;
				this.tickmarkOffset = this.categories && "between" === a.tickmarkPlacement && 1 === this.tickInterval ? .5 : 0;
				this.minorTickInterval = "auto" === b && this.tickInterval ? this.tickInterval / 5 : b;
				this.single = this.min === this.max && q(this.min) && !this.tickAmount && (parseInt(this.min, 10) === this.min || !1 !== a.allowDecimals);
				this.tickPositions = b = c && c.slice();
				!b && (b = this.isDatetimeAxis ? this.getTimeTicks(this.normalizeTimeTickInterval(this.tickInterval, a.units), this.min, this.max, a.startOfWeek, this.ordinalPositions, this.closestPointRange, !0) : this.isLog ? this.getLogTickPositions(this.tickInterval, this.min, this.max) : this.getLinearTickPositions(this.tickInterval, this.min, this.max), b.length > this.len && (b = [b[0], b.pop()], b[0] === b[1] && (b.length = 1)), this.tickPositions = b, h && (h = h.apply(this, [this.min, this.max]))) && (this.tickPositions = b = h);
				this.paddedTicks = b.slice(0);
				this.trimTicks(b, e, k);
				this.isLinked || (this.single && 2 > b.length && (this.min -= .5, this.max += .5), c || h || this.adjustTickAmount())
			},
			trimTicks: function(a, b, c) {
				var p = a[0],
					h = a[a.length - 1],
					e = this.minPointOffset || 0;
				if(!this.isLinked) {
					if(b && -Infinity !== p) this.min = p;
					else
						for(; this.min - e > a[0];) a.shift();
					if(c) this.max = h;
					else
						for(; this.max + e < a[a.length - 1];) a.pop();
					0 === a.length && q(p) && a.push((h + p) / 2)
				}
			},
			alignToOthers: function() {
				var a = {},
					b, c = this.options;
				!1 === this.chart.options.chart.alignTicks || !1 === c.alignTicks || this.isLog ||
					g(this.chart[this.coll], function(c) {
						var p = c.options,
							p = [c.horiz ? p.left : p.top, p.width, p.height, p.pane].join();
						c.series.length && (a[p] ? b = !0 : a[p] = 1)
					});
				return b
			},
			getTickAmount: function() {
				var a = this.options,
					b = a.tickAmount,
					c = a.tickPixelInterval;
				!q(a.tickInterval) && this.len < c && !this.isRadial && !this.isLog && a.startOnTick && a.endOnTick && (b = 2);
				!b && this.alignToOthers() && (b = Math.ceil(this.len / c) + 1);
				4 > b && (this.finalTickAmt = b, b = 5);
				this.tickAmount = b
			},
			adjustTickAmount: function() {
				var a = this.tickInterval,
					b = this.tickPositions,
					c = this.tickAmount,
					h = this.finalTickAmt,
					e = b && b.length;
				if(e < c) {
					for(; b.length < c;) b.push(v(b[b.length - 1] + a));
					this.transA *= (e - 1) / (c - 1);
					this.max = b[b.length - 1]
				} else e > c && (this.tickInterval *= 2, this.setTickPositions());
				if(q(h)) {
					for(a = c = b.length; a--;)(3 === h && 1 === a % 2 || 2 >= h && 0 < a && a < c - 1) && b.splice(a, 1);
					this.finalTickAmt = void 0
				}
			},
			setScale: function() {
				var a, b;
				this.oldMin = this.min;
				this.oldMax = this.max;
				this.oldAxisLength = this.len;
				this.setAxisSize();
				b = this.len !== this.oldAxisLength;
				g(this.series, function(b) {
					if(b.isDirtyData ||
						b.isDirty || b.xAxis.isDirty) a = !0
				});
				b || a || this.isLinked || this.forceRedraw || this.userMin !== this.oldUserMin || this.userMax !== this.oldUserMax || this.alignToOthers() ? (this.resetStacks && this.resetStacks(), this.forceRedraw = !1, this.getSeriesExtremes(), this.setTickInterval(), this.oldUserMin = this.userMin, this.oldUserMax = this.userMax, this.isDirty || (this.isDirty = b || this.min !== this.oldMin || this.max !== this.oldMax)) : this.cleanStacks && this.cleanStacks()
			},
			setExtremes: function(a, b, c, h, e) {
				var p = this,
					k = p.chart;
				c = z(c, !0);
				g(p.series, function(a) {
					delete a.kdTree
				});
				e = r(e, {
					min: a,
					max: b
				});
				m(p, "setExtremes", e, function() {
					p.userMin = a;
					p.userMax = b;
					p.eventArgs = e;
					c && k.redraw(h)
				})
			},
			zoom: function(a, b) {
				var c = this.dataMin,
					p = this.dataMax,
					h = this.options,
					e = Math.min(c, z(h.min, c)),
					h = Math.max(p, z(h.max, p));
				if(a !== this.min || b !== this.max) this.allowZoomOutside || (q(c) && (a < e && (a = e), a > h && (a = h)), q(p) && (b < e && (b = e), b > h && (b = h))), this.displayBtn = void 0 !== a || void 0 !== b, this.setExtremes(a, b, !1, void 0, {
					trigger: "zoom"
				});
				return !0
			},
			setAxisSize: function() {
				var b =
					this.chart,
					c = this.options,
					h = c.offsets || [0, 0, 0, 0],
					e = this.horiz,
					k = this.width = Math.round(a.relativeLength(z(c.width, b.plotWidth - h[3] + h[1]), b.plotWidth)),
					g = this.height = Math.round(a.relativeLength(z(c.height, b.plotHeight - h[0] + h[2]), b.plotHeight)),
					w = this.top = Math.round(a.relativeLength(z(c.top, b.plotTop + h[0]), b.plotHeight, b.plotTop)),
					c = this.left = Math.round(a.relativeLength(z(c.left, b.plotLeft + h[3]), b.plotWidth, b.plotLeft));
				this.bottom = b.chartHeight - g - w;
				this.right = b.chartWidth - k - c;
				this.len = Math.max(e ? k :
					g, 0);
				this.pos = e ? c : w
			},
			getExtremes: function() {
				var a = this.isLog,
					b = this.lin2log;
				return {
					min: a ? v(b(this.min)) : this.min,
					max: a ? v(b(this.max)) : this.max,
					dataMin: this.dataMin,
					dataMax: this.dataMax,
					userMin: this.userMin,
					userMax: this.userMax
				}
			},
			getThreshold: function(a) {
				var b = this.isLog,
					c = this.lin2log,
					h = b ? c(this.min) : this.min,
					b = b ? c(this.max) : this.max;
				null === a ? a = h : h > a ? a = h : b < a && (a = b);
				return this.translate(a, 0, 1, 0, 1)
			},
			autoLabelAlign: function(a) {
				a = (z(a, 0) - 90 * this.side + 720) % 360;
				return 15 < a && 165 > a ? "right" : 195 < a && 345 > a ?
					"left" : "center"
			},
			tickSize: function(a) {
				var b = this.options,
					c = b[a + "Length"],
					h = z(b[a + "Width"], "tick" === a && this.isXAxis ? 1 : 0);
				if(h && c) return "inside" === b[a + "Position"] && (c = -c), [c, h]
			},
			labelMetrics: function() {
				var a = this.tickPositions && this.tickPositions[0] || 0;
				return this.chart.renderer.fontMetrics(this.options.labels.style && this.options.labels.style.fontSize, this.ticks[a] && this.ticks[a].label)
			},
			unsquish: function() {
				var a = this.options.labels,
					b = this.horiz,
					c = this.tickInterval,
					h = c,
					e = this.len / (((this.categories ?
						1 : 0) + this.max - this.min) / c),
					k, w = a.rotation,
					d = this.labelMetrics(),
					f, l = Number.MAX_VALUE,
					m, G = function(a) {
						a /= e || 1;
						a = 1 < a ? Math.ceil(a) : 1;
						return a * c
					};
				b ? (m = !a.staggerLines && !a.step && (q(w) ? [w] : e < z(a.autoRotationLimit, 80) && a.autoRotation)) && g(m, function(a) {
					var b;
					if(a === w || a && -90 <= a && 90 >= a) f = G(Math.abs(d.h / Math.sin(n * a))), b = f + Math.abs(a / 360), b < l && (l = b, k = a, h = f)
				}) : a.step || (h = G(d.h));
				this.autoRotation = m;
				this.labelRotation = z(k, w);
				return h
			},
			getSlotWidth: function() {
				var a = this.chart,
					b = this.horiz,
					c = this.options.labels,
					h = Math.max(this.tickPositions.length - (this.categories ? 0 : 1), 1),
					e = a.margin[3];
				return b && 2 > (c.step || 0) && !c.rotation && (this.staggerLines || 1) * this.len / h || !b && (c.style && parseInt(c.style.width, 10) || e && e - a.spacing[3] || .33 * a.chartWidth)
			},
			renderUnsquish: function() {
				var a = this.chart,
					b = a.renderer,
					c = this.tickPositions,
					h = this.ticks,
					e = this.options.labels,
					k = this.horiz,
					w = this.getSlotWidth(),
					d = Math.max(1, Math.round(w - 2 * (e.padding || 5))),
					f = {},
					l = this.labelMetrics(),
					m = e.style && e.style.textOverflow,
					G, E = 0,
					r, F;
				I(e.rotation) ||
					(f.rotation = e.rotation || 0);
				g(c, function(a) {
					(a = h[a]) && a.labelLength > E && (E = a.labelLength)
				});
				this.maxLabelLength = E;
				if(this.autoRotation) E > d && E > l.h ? f.rotation = this.labelRotation : this.labelRotation = 0;
				else if(w && (G = {
						width: d + "px"
					}, !m))
					for(G.textOverflow = "clip", r = c.length; !k && r--;)
						if(F = c[r], d = h[F].label) d.styles && "ellipsis" === d.styles.textOverflow ? d.css({
							textOverflow: "clip"
						}) : h[F].labelLength > w && d.css({
							width: w + "px"
						}), d.getBBox().height > this.len / c.length - (l.h - l.f) && (d.specCss = {
							textOverflow: "ellipsis"
						});
				f.rotation &&
					(G = {
						width: (E > .5 * a.chartHeight ? .33 * a.chartHeight : a.chartHeight) + "px"
					}, m || (G.textOverflow = "ellipsis"));
				if(this.labelAlign = e.align || this.autoLabelAlign(this.labelRotation)) f.align = this.labelAlign;
				g(c, function(a) {
					var b = (a = h[a]) && a.label;
					b && (b.attr(f), G && b.css(B(G, b.specCss)), delete b.specCss, a.rotation = f.rotation)
				});
				this.tickRotCorr = b.rotCorr(l.b, this.labelRotation || 0, 0 !== this.side)
			},
			hasData: function() {
				return this.hasVisibleSeries || q(this.min) && q(this.max) && this.tickPositions && 0 < this.tickPositions.length
			},
			addTitle: function(a) {
				var b = this.chart.renderer,
					c = this.horiz,
					h = this.opposite,
					e = this.options.title,
					p;
				this.axisTitle || ((p = e.textAlign) || (p = (c ? {
					low: "left",
					middle: "center",
					high: "right"
				} : {
					low: h ? "right" : "left",
					middle: "center",
					high: h ? "left" : "right"
				})[e.align]), this.axisTitle = b.text(e.text, 0, 0, e.useHTML).attr({
					zIndex: 7,
					rotation: e.rotation || 0,
					align: p
				}).addClass("highcharts-axis-title").css(e.style).add(this.axisGroup), this.axisTitle.isNew = !0);
				e.style.width || this.isRadial || this.axisTitle.css({
					width: this.len
				});
				this.axisTitle[a ? "show" : "hide"](!0)
			},
			generateTick: function(a) {
				var b = this.ticks;
				b[a] ? b[a].addLabel() : b[a] = new E(this, a)
			},
			getOffset: function() {
				var a = this,
					b = a.chart,
					c = b.renderer,
					h = a.options,
					e = a.tickPositions,
					k = a.ticks,
					w = a.horiz,
					d = a.side,
					f = b.inverted && !a.isZAxis ? [1, 0, 3, 2][d] : d,
					l, m, G = 0,
					E, r = 0,
					B = h.title,
					D = h.labels,
					n = 0,
					H = b.axisOffset,
					b = b.clipOffset,
					I = [-1, 1, 1, -1][d],
					v = h.className,
					t = a.axisParent,
					J = this.tickSize("tick");
				l = a.hasData();
				a.showAxis = m = l || z(h.showEmpty, !0);
				a.staggerLines = a.horiz && D.staggerLines;
				a.axisGroup ||
					(a.gridGroup = c.g("grid").attr({
						zIndex: h.gridZIndex || 1
					}).addClass("highcharts-" + this.coll.toLowerCase() + "-grid " + (v || "")).add(t), a.axisGroup = c.g("axis").attr({
						zIndex: h.zIndex || 2
					}).addClass("highcharts-" + this.coll.toLowerCase() + " " + (v || "")).add(t), a.labelGroup = c.g("axis-labels").attr({
						zIndex: D.zIndex || 7
					}).addClass("highcharts-" + a.coll.toLowerCase() + "-labels " + (v || "")).add(t));
				l || a.isLinked ? (g(e, function(b, c) {
						a.generateTick(b, c)
					}), a.renderUnsquish(), !1 === D.reserveSpace || 0 !== d && 2 !== d && {
						1: "left",
						3: "right"
					}[d] !==
					a.labelAlign && "center" !== a.labelAlign || g(e, function(a) {
						n = Math.max(k[a].getLabelSize(), n)
					}), a.staggerLines && (n *= a.staggerLines, a.labelOffset = n * (a.opposite ? -1 : 1))) : F(k, function(a, b) {
					a.destroy();
					delete k[b]
				});
				B && B.text && !1 !== B.enabled && (a.addTitle(m), m && !1 !== B.reserveSpace && (a.titleOffset = G = a.axisTitle.getBBox()[w ? "height" : "width"], E = B.offset, r = q(E) ? 0 : z(B.margin, w ? 5 : 10)));
				a.renderLine();
				a.offset = I * z(h.offset, H[d]);
				a.tickRotCorr = a.tickRotCorr || {
					x: 0,
					y: 0
				};
				c = 0 === d ? -a.labelMetrics().h : 2 === d ? a.tickRotCorr.y :
					0;
				r = Math.abs(n) + r;
				n && (r = r - c + I * (w ? z(D.y, a.tickRotCorr.y + 8 * I) : D.x));
				a.axisTitleMargin = z(E, r);
				H[d] = Math.max(H[d], a.axisTitleMargin + G + I * a.offset, r, l && e.length && J ? J[0] + I * a.offset : 0);
				h = h.offset ? 0 : 2 * Math.floor(a.axisLine.strokeWidth() / 2);
				b[f] = Math.max(b[f], h)
			},
			getLinePath: function(a) {
				var b = this.chart,
					c = this.opposite,
					h = this.offset,
					e = this.horiz,
					p = this.left + (c ? this.width : 0) + h,
					h = b.chartHeight - this.bottom - (c ? this.height : 0) + h;
				c && (a *= -1);
				return b.renderer.crispLine(["M", e ? this.left : p, e ? h : this.top, "L", e ? b.chartWidth -
					this.right : p, e ? h : b.chartHeight - this.bottom
				], a)
			},
			renderLine: function() {
				this.axisLine || (this.axisLine = this.chart.renderer.path().addClass("highcharts-axis-line").add(this.axisGroup), this.axisLine.attr({
					stroke: this.options.lineColor,
					"stroke-width": this.options.lineWidth,
					zIndex: 7
				}))
			},
			getTitlePosition: function() {
				var a = this.horiz,
					b = this.left,
					c = this.top,
					h = this.len,
					e = this.options.title,
					k = a ? b : c,
					w = this.opposite,
					g = this.offset,
					d = e.x || 0,
					f = e.y || 0,
					l = this.axisTitle,
					m = this.chart.renderer.fontMetrics(e.style && e.style.fontSize,
						l),
					l = Math.max(l.getBBox(null, 0).height - m.h - 1, 0),
					h = {
						low: k + (a ? 0 : h),
						middle: k + h / 2,
						high: k + (a ? h : 0)
					}[e.align],
					b = (a ? c + this.height : b) + (a ? 1 : -1) * (w ? -1 : 1) * this.axisTitleMargin + [-l, l, m.f, -l][this.side];
				return {
					x: a ? h + d : b + (w ? this.width : 0) + g + d,
					y: a ? b + f - (w ? this.height : 0) + g : h + f
				}
			},
			renderMinorTick: function(a) {
				var b = this.chart.hasRendered && D(this.oldMin),
					c = this.minorTicks;
				c[a] || (c[a] = new E(this, a, "minor"));
				b && c[a].isNew && c[a].render(null, !0);
				c[a].render(null, !1, 1)
			},
			renderTick: function(a, b) {
				var c = this.isLinked,
					h = this.ticks,
					e = this.chart.hasRendered && D(this.oldMin);
				if(!c || a >= this.min && a <= this.max) h[a] || (h[a] = new E(this, a)), e && h[a].isNew && h[a].render(b, !0, .1), h[a].render(b)
			},
			render: function() {
				var b = this,
					c = b.chart,
					h = b.options,
					e = b.isLog,
					k = b.lin2log,
					w = b.isLinked,
					d = b.tickPositions,
					f = b.axisTitle,
					l = b.ticks,
					m = b.minorTicks,
					r = b.alternateBands,
					B = h.stackLabels,
					z = h.alternateGridColor,
					n = b.tickmarkOffset,
					H = b.axisLine,
					I = b.showAxis,
					q = C(c.renderer.globalAnimation),
					v, t;
				b.labelEdge.length = 0;
				b.overlap = !1;
				g([l, m, r], function(a) {
					F(a, function(a) {
						a.isActive = !1
					})
				});
				if(b.hasData() || w) b.minorTickInterval && !b.categories && g(b.getMinorTickPositions(), function(a) {
					b.renderMinorTick(a)
				}), d.length && (g(d, function(a, c) {
					b.renderTick(a, c)
				}), n && (0 === b.min || b.single) && (l[-1] || (l[-1] = new E(b, -1, null, !0)), l[-1].render(-1))), z && g(d, function(h, p) {
					t = void 0 !== d[p + 1] ? d[p + 1] + n : b.max - n;
					0 === p % 2 && h < b.max && t <= b.max + (c.polar ? -n : n) && (r[h] || (r[h] = new a.PlotLineOrBand(b)), v = h + n, r[h].options = {
						from: e ? k(v) : v,
						to: e ? k(t) : t,
						color: z
					}, r[h].render(), r[h].isActive = !0)
				}), b._addedPlotLB || (g((h.plotLines || []).concat(h.plotBands || []), function(a) {
					b.addPlotBandOrLine(a)
				}), b._addedPlotLB = !0);
				g([l, m, r], function(a) {
					var b, h = [],
						e = q.duration;
					F(a, function(a, b) {
						a.isActive || (a.render(b, !1, 0), a.isActive = !1, h.push(b))
					});
					G(function() {
						for(b = h.length; b--;) a[h[b]] && !a[h[b]].isActive && (a[h[b]].destroy(), delete a[h[b]])
					}, a !== r && c.hasRendered && e ? e : 0)
				});
				H && (H[H.isPlaced ? "animate" : "attr"]({
					d: this.getLinePath(H.strokeWidth())
				}), H.isPlaced = !0, H[I ? "show" : "hide"](!0));
				f && I && (h = b.getTitlePosition(), D(h.y) ? (f[f.isNew ? "attr" : "animate"](h),
					f.isNew = !1) : (f.attr("y", -9999), f.isNew = !0));
				B && B.enabled && b.renderStackTotals();
				b.isDirty = !1
			},
			redraw: function() {
				this.visible && (this.render(), g(this.plotLinesAndBands, function(a) {
					a.render()
				}));
				g(this.series, function(a) {
					a.isDirty = !0
				})
			},
			keepProps: "extKey hcEvents names series userMax userMin".split(" "),
			destroy: function(a) {
				var b = this,
					h = b.stacks,
					e = b.plotLinesAndBands,
					k;
				a || N(b);
				F(h, function(a, b) {
					l(a);
					h[b] = null
				});
				g([b.ticks, b.minorTicks, b.alternateBands], function(a) {
					l(a)
				});
				if(e)
					for(a = e.length; a--;) e[a].destroy();
				g("stackTotalGroup axisLine axisTitle axisGroup gridGroup labelGroup cross".split(" "), function(a) {
					b[a] && (b[a] = b[a].destroy())
				});
				for(k in b.plotLinesAndBandsGroups) b.plotLinesAndBandsGroups[k] = b.plotLinesAndBandsGroups[k].destroy();
				F(b, function(a, h) {
					-1 === c(h, b.keepProps) && delete b[h]
				})
			},
			drawCrosshair: function(a, b) {
				var c, h = this.crosshair,
					e = z(h.snap, !0),
					k, p = this.cross;
				a || (a = this.cross && this.cross.e);
				this.crosshair && !1 !== (q(b) || !e) ? (e ? q(b) && (k = this.isXAxis ? b.plotX : this.len - b.plotY) : k = a && (this.horiz ?
					a.chartX - this.pos : this.len - a.chartY + this.pos), q(k) && (c = this.getPlotLinePath(b && (this.isXAxis ? b.x : z(b.stackY, b.y)), null, null, null, k) || null), q(c) ? (b = this.categories && !this.isRadial, p || (this.cross = p = this.chart.renderer.path().addClass("highcharts-crosshair highcharts-crosshair-" + (b ? "category " : "thin ") + h.className).attr({
						zIndex: z(h.zIndex, 2)
					}).add(), p.attr({
						stroke: h.color || (b ? d("#ccd6eb").setOpacity(.25).get() : "#cccccc"),
						"stroke-width": z(h.width, 1)
					}).css({
						"pointer-events": "none"
					}), h.dashStyle && p.attr({
						dashstyle: h.dashStyle
					})),
					p.show().attr({
						d: c
					}), b && !h.width && p.attr({
						"stroke-width": this.transA
					}), this.cross.e = a) : this.hideCrosshair()) : this.hideCrosshair()
			},
			hideCrosshair: function() {
				this.cross && this.cross.hide()
			}
		});
		return a.Axis = H
	}(K);
	(function(a) {
		var y = a.Axis,
			C = a.getMagnitude,
			x = a.map,
			f = a.normalizeTickInterval,
			d = a.pick;
		y.prototype.getLogTickPositions = function(a, t, q, n) {
			var l = this.options,
				g = this.len,
				r = this.lin2log,
				m = this.log2lin,
				k = [];
			n || (this._minorAutoInterval = null);
			if(.5 <= a) a = Math.round(a), k = this.getLinearTickPositions(a,
				t, q);
			else if(.08 <= a)
				for(var g = Math.floor(t), e, b, c, h, D, l = .3 < a ? [1, 2, 4] : .15 < a ? [1, 2, 4, 6, 8] : [1, 2, 3, 4, 5, 6, 7, 8, 9]; g < q + 1 && !D; g++)
					for(b = l.length, e = 0; e < b && !D; e++) c = m(r(g) * l[e]), c > t && (!n || h <= q) && void 0 !== h && k.push(h), h > q && (D = !0), h = c;
			else t = r(t), q = r(q), a = n ? this.getMinorTickInterval() : l.tickInterval, a = d("auto" === a ? null : a, this._minorAutoInterval, l.tickPixelInterval / (n ? 5 : 1) * (q - t) / ((n ? g / this.tickPositions.length : g) || 1)), a = f(a, null, C(a)), k = x(this.getLinearTickPositions(a, t, q), m), n || (this._minorAutoInterval = a / 5);
			n ||
				(this.tickInterval = a);
			return k
		};
		y.prototype.log2lin = function(a) {
			return Math.log(a) / Math.LN10
		};
		y.prototype.lin2log = function(a) {
			return Math.pow(10, a)
		}
	})(K);
	(function(a, y) {
		var C = a.arrayMax,
			x = a.arrayMin,
			f = a.defined,
			d = a.destroyObjectProperties,
			v = a.each,
			t = a.erase,
			q = a.merge,
			n = a.pick;
		a.PlotLineOrBand = function(a, g) {
			this.axis = a;
			g && (this.options = g, this.id = g.id)
		};
		a.PlotLineOrBand.prototype = {
			render: function() {
				var d = this,
					g = d.axis,
					r = g.horiz,
					m = d.options,
					k = m.label,
					e = d.label,
					b = m.to,
					c = m.from,
					h = m.value,
					D = f(c) && f(b),
					I = f(h),
					B = d.svgElem,
					t = !B,
					F = [],
					z = m.color,
					v = n(m.zIndex, 0),
					w = m.events,
					F = {
						"class": "highcharts-plot-" + (D ? "band " : "line ") + (m.className || "")
					},
					G = {},
					E = g.chart.renderer,
					H = D ? "bands" : "lines",
					p = g.log2lin;
				g.isLog && (c = p(c), b = p(b), h = p(h));
				I ? (F = {
					stroke: z,
					"stroke-width": m.width
				}, m.dashStyle && (F.dashstyle = m.dashStyle)) : D && (z && (F.fill = z), m.borderWidth && (F.stroke = m.borderColor, F["stroke-width"] = m.borderWidth));
				G.zIndex = v;
				H += "-" + v;
				(z = g.plotLinesAndBandsGroups[H]) || (g.plotLinesAndBandsGroups[H] = z = E.g("plot-" + H).attr(G).add());
				t && (d.svgElem = B = E.path().attr(F).add(z));
				if(I) F = g.getPlotLinePath(h, B.strokeWidth());
				else if(D) F = g.getPlotBandPath(c, b, m);
				else return;
				t && F && F.length ? (B.attr({
					d: F
				}), w && a.objectEach(w, function(a, b) {
					B.on(b, function(a) {
						w[b].apply(d, [a])
					})
				})) : B && (F ? (B.show(), B.animate({
					d: F
				})) : (B.hide(), e && (d.label = e = e.destroy())));
				k && f(k.text) && F && F.length && 0 < g.width && 0 < g.height && !F.flat ? (k = q({
					align: r && D && "center",
					x: r ? !D && 4 : 10,
					verticalAlign: !r && D && "middle",
					y: r ? D ? 16 : 10 : D ? 6 : -4,
					rotation: r && !D && 90
				}, k), this.renderLabel(k, F,
					D, v)) : e && e.hide();
				return d
			},
			renderLabel: function(a, g, d, f) {
				var k = this.label,
					e = this.axis.chart.renderer;
				k || (k = {
					align: a.textAlign || a.align,
					rotation: a.rotation,
					"class": "highcharts-plot-" + (d ? "band" : "line") + "-label " + (a.className || "")
				}, k.zIndex = f, this.label = k = e.text(a.text, 0, 0, a.useHTML).attr(k).add(), k.css(a.style));
				f = g.xBounds || [g[1], g[4], d ? g[6] : g[1]];
				g = g.yBounds || [g[2], g[5], d ? g[7] : g[2]];
				d = x(f);
				e = x(g);
				k.align(a, !1, {
					x: d,
					y: e,
					width: C(f) - d,
					height: C(g) - e
				});
				k.show()
			},
			destroy: function() {
				t(this.axis.plotLinesAndBands,
					this);
				delete this.axis;
				d(this)
			}
		};
		a.extend(y.prototype, {
			getPlotBandPath: function(a, g) {
				var d = this.getPlotLinePath(g, null, null, !0),
					f = this.getPlotLinePath(a, null, null, !0),
					k = [],
					e = this.horiz,
					b = 1,
					c;
				a = a < this.min && g < this.min || a > this.max && g > this.max;
				if(f && d)
					for(a && (c = f.toString() === d.toString(), b = 0), a = 0; a < f.length; a += 6) e && d[a + 1] === f[a + 1] ? (d[a + 1] += b, d[a + 4] += b) : e || d[a + 2] !== f[a + 2] || (d[a + 2] += b, d[a + 5] += b), k.push("M", f[a + 1], f[a + 2], "L", f[a + 4], f[a + 5], d[a + 4], d[a + 5], d[a + 1], d[a + 2], "z"), k.flat = c;
				return k
			},
			addPlotBand: function(a) {
				return this.addPlotBandOrLine(a,
					"plotBands")
			},
			addPlotLine: function(a) {
				return this.addPlotBandOrLine(a, "plotLines")
			},
			addPlotBandOrLine: function(d, g) {
				var f = (new a.PlotLineOrBand(this, d)).render(),
					m = this.userOptions;
				f && (g && (m[g] = m[g] || [], m[g].push(d)), this.plotLinesAndBands.push(f));
				return f
			},
			removePlotBandOrLine: function(a) {
				for(var g = this.plotLinesAndBands, d = this.options, f = this.userOptions, k = g.length; k--;) g[k].id === a && g[k].destroy();
				v([d.plotLines || [], f.plotLines || [], d.plotBands || [], f.plotBands || []], function(e) {
					for(k = e.length; k--;) e[k].id ===
						a && t(e, e[k])
				})
			},
			removePlotBand: function(a) {
				this.removePlotBandOrLine(a)
			},
			removePlotLine: function(a) {
				this.removePlotBandOrLine(a)
			}
		})
	})(K, V);
	(function(a) {
		var y = a.dateFormat,
			C = a.each,
			x = a.extend,
			f = a.format,
			d = a.isNumber,
			v = a.map,
			t = a.merge,
			q = a.pick,
			n = a.splat,
			l = a.syncTimeout,
			g = a.timeUnits;
		a.Tooltip = function() {
			this.init.apply(this, arguments)
		};
		a.Tooltip.prototype = {
			init: function(a, g) {
				this.chart = a;
				this.options = g;
				this.crosshairs = [];
				this.now = {
					x: 0,
					y: 0
				};
				this.isHidden = !0;
				this.split = g.split && !a.inverted;
				this.shared =
					g.shared || this.split
			},
			cleanSplit: function(a) {
				C(this.chart.series, function(g) {
					var k = g && g.tt;
					k && (!k.isActive || a ? g.tt = k.destroy() : k.isActive = !1)
				})
			},
			getLabel: function() {
				var a = this.chart.renderer,
					g = this.options;
				this.label || (this.split ? this.label = a.g("tooltip") : (this.label = a.label("", 0, 0, g.shape || "callout", null, null, g.useHTML, null, "tooltip").attr({
					padding: g.padding,
					r: g.borderRadius
				}), this.label.attr({
					fill: g.backgroundColor,
					"stroke-width": g.borderWidth
				}).css(g.style).shadow(g.shadow)), this.label.attr({
					zIndex: 8
				}).add());
				return this.label
			},
			update: function(a) {
				this.destroy();
				t(!0, this.chart.options.tooltip.userOptions, a);
				this.init(this.chart, t(!0, this.options, a))
			},
			destroy: function() {
				this.label && (this.label = this.label.destroy());
				this.split && this.tt && (this.cleanSplit(this.chart, !0), this.tt = this.tt.destroy());
				clearTimeout(this.hideTimer);
				clearTimeout(this.tooltipTimeout)
			},
			move: function(a, g, k, e) {
				var b = this,
					c = b.now,
					h = !1 !== b.options.animation && !b.isHidden && (1 < Math.abs(a - c.x) || 1 < Math.abs(g - c.y)),
					d = b.followPointer || 1 < b.len;
				x(c, {
					x: h ? (2 * c.x + a) / 3 : a,
					y: h ? (c.y + g) / 2 : g,
					anchorX: d ? void 0 : h ? (2 * c.anchorX + k) / 3 : k,
					anchorY: d ? void 0 : h ? (c.anchorY + e) / 2 : e
				});
				b.getLabel().attr(c);
				h && (clearTimeout(this.tooltipTimeout), this.tooltipTimeout = setTimeout(function() {
					b && b.move(a, g, k, e)
				}, 32))
			},
			hide: function(a) {
				var g = this;
				clearTimeout(this.hideTimer);
				a = q(a, this.options.hideDelay, 500);
				this.isHidden || (this.hideTimer = l(function() {
					g.getLabel()[a ? "fadeOut" : "hide"]();
					g.isHidden = !0
				}, a))
			},
			getAnchor: function(a, g) {
				var k, e = this.chart,
					b = e.inverted,
					c = e.plotTop,
					h = e.plotLeft,
					d = 0,
					f = 0,
					l, m;
				a = n(a);
				k = a[0].tooltipPos;
				this.followPointer && g && (void 0 === g.chartX && (g = e.pointer.normalize(g)), k = [g.chartX - e.plotLeft, g.chartY - c]);
				k || (C(a, function(a) {
					l = a.series.yAxis;
					m = a.series.xAxis;
					d += a.plotX + (!b && m ? m.left - h : 0);
					f += (a.plotLow ? (a.plotLow + a.plotHigh) / 2 : a.plotY) + (!b && l ? l.top - c : 0)
				}), d /= a.length, f /= a.length, k = [b ? e.plotWidth - f : d, this.shared && !b && 1 < a.length && g ? g.chartY - c : b ? e.plotHeight - d : f]);
				return v(k, Math.round)
			},
			getPosition: function(a, g, k) {
				var e = this.chart,
					b = this.distance,
					c = {},
					h = e.inverted && k.h || 0,
					d, f = ["y", e.chartHeight, g, k.plotY + e.plotTop, e.plotTop, e.plotTop + e.plotHeight],
					l = ["x", e.chartWidth, a, k.plotX + e.plotLeft, e.plotLeft, e.plotLeft + e.plotWidth],
					m = !this.followPointer && q(k.ttBelow, !e.inverted === !!k.negative),
					F = function(a, e, k, g, d, w) {
						var p = k < g - b,
							f = g + b + k < e,
							u = g - b - k;
						g += b;
						if(m && f) c[a] = g;
						else if(!m && p) c[a] = u;
						else if(p) c[a] = Math.min(w - k, 0 > u - h ? u : u - h);
						else if(f) c[a] = Math.max(d, g + h + k > e ? g : g + h);
						else return !1
					},
					r = function(a, h, e, k) {
						var g;
						k < b || k > h - b ? g = !1 : c[a] = k < e / 2 ? 1 : k > h - e / 2 ? h - e -
							2 : k - e / 2;
						return g
					},
					n = function(a) {
						var b = f;
						f = l;
						l = b;
						d = a
					},
					w = function() {
						!1 !== F.apply(0, f) ? !1 !== r.apply(0, l) || d || (n(!0), w()) : d ? c.x = c.y = 0 : (n(!0), w())
					};
				(e.inverted || 1 < this.len) && n();
				w();
				return c
			},
			defaultFormatter: function(a) {
				var g = this.points || n(this),
					k;
				k = [a.tooltipFooterHeaderFormatter(g[0])];
				k = k.concat(a.bodyFormatter(g));
				k.push(a.tooltipFooterHeaderFormatter(g[0], !0));
				return k
			},
			refresh: function(a, g) {
				var k, e = this.options,
					b, c = a,
					h, d = {},
					f = [];
				k = e.formatter || this.defaultFormatter;
				var d = this.shared,
					l;
				e.enabled &&
					(clearTimeout(this.hideTimer), this.followPointer = n(c)[0].series.tooltipOptions.followPointer, h = this.getAnchor(c, g), g = h[0], b = h[1], !d || c.series && c.series.noSharedTooltip ? d = c.getLabelConfig() : (C(c, function(a) {
						a.setState("hover");
						f.push(a.getLabelConfig())
					}), d = {
						x: c[0].category,
						y: c[0].y
					}, d.points = f, c = c[0]), this.len = f.length, d = k.call(d, this), l = c.series, this.distance = q(l.tooltipOptions.distance, 16), !1 === d ? this.hide() : (k = this.getLabel(), this.isHidden && k.attr({
						opacity: 1
					}).show(), this.split ? this.renderSplit(d,
						n(a)) : (e.style.width || k.css({
						width: this.chart.spacingBox.width
					}), k.attr({
						text: d && d.join ? d.join("") : d
					}), k.removeClass(/highcharts-color-[\d]+/g).addClass("highcharts-color-" + q(c.colorIndex, l.colorIndex)), k.attr({
						stroke: e.borderColor || c.color || l.color || "#666666"
					}), this.updatePosition({
						plotX: g,
						plotY: b,
						negative: c.negative,
						ttBelow: c.ttBelow,
						h: h[2] || 0
					})), this.isHidden = !1))
			},
			renderSplit: function(g, d) {
				var k = this,
					e = [],
					b = this.chart,
					c = b.renderer,
					h = !0,
					f = this.options,
					l = 0,
					m = this.getLabel();
				a.isString(g) && (g = [!1,
					g
				]);
				C(g.slice(0, d.length + 1), function(a, g) {
					if(!1 !== a) {
						g = d[g - 1] || {
							isHeader: !0,
							plotX: d[0].plotX
						};
						var B = g.series || k,
							F = B.tt,
							w = g.series || {},
							G = "highcharts-color-" + q(g.colorIndex, w.colorIndex, "none");
						F || (B.tt = F = c.label(null, null, null, "callout", null, null, f.useHTML).addClass("highcharts-tooltip-box " + G).attr({
							padding: f.padding,
							r: f.borderRadius,
							fill: f.backgroundColor,
							stroke: f.borderColor || g.color || w.color || "#333333",
							"stroke-width": f.borderWidth
						}).add(m));
						F.isActive = !0;
						F.attr({
							text: a
						});
						F.css(f.style).shadow(f.shadow);
						a = F.getBBox();
						w = a.width + F.strokeWidth();
						g.isHeader ? (l = a.height, w = Math.max(0, Math.min(g.plotX + b.plotLeft - w / 2, b.chartWidth - w))) : w = g.plotX + b.plotLeft - q(f.distance, 16) - w;
						0 > w && (h = !1);
						a = (g.series && g.series.yAxis && g.series.yAxis.pos) + (g.plotY || 0);
						a -= b.plotTop;
						e.push({
							target: g.isHeader ? b.plotHeight + l : a,
							rank: g.isHeader ? 1 : 0,
							size: B.tt.getBBox().height + 1,
							point: g,
							x: w,
							tt: F
						})
					}
				});
				this.cleanSplit();
				a.distribute(e, b.plotHeight + l);
				C(e, function(a) {
					var c = a.point,
						e = c.series;
					a.tt.attr({
						visibility: void 0 === a.pos ? "hidden" : "inherit",
						x: h || c.isHeader ? a.x : c.plotX + b.plotLeft + q(f.distance, 16),
						y: a.pos + b.plotTop,
						anchorX: c.isHeader ? c.plotX + b.plotLeft : c.plotX + e.xAxis.pos,
						anchorY: c.isHeader ? a.pos + b.plotTop - 15 : c.plotY + e.yAxis.pos
					})
				})
			},
			updatePosition: function(a) {
				var g = this.chart,
					k = this.getLabel(),
					k = (this.options.positioner || this.getPosition).call(this, k.width, k.height, a);
				this.move(Math.round(k.x), Math.round(k.y || 0), a.plotX + g.plotLeft, a.plotY + g.plotTop)
			},
			getDateFormat: function(a, d, k, e) {
				var b = y("%m-%d %H:%M:%S.%L", d),
					c, h, f = {
						millisecond: 15,
						second: 12,
						minute: 9,
						hour: 6,
						day: 3
					},
					l = "millisecond";
				for(h in g) {
					if(a === g.week && +y("%w", d) === k && "00:00:00.000" === b.substr(6)) {
						h = "week";
						break
					}
					if(g[h] > a) {
						h = l;
						break
					}
					if(f[h] && b.substr(f[h]) !== "01-01 00:00:00.000".substr(f[h])) break;
					"week" !== h && (l = h)
				}
				h && (c = e[h]);
				return c
			},
			getXDateFormat: function(a, g, k) {
				g = g.dateTimeLabelFormats;
				var e = k && k.closestPointRange;
				return(e ? this.getDateFormat(e, a.x, k.options.startOfWeek, g) : g.day) || g.year
			},
			tooltipFooterHeaderFormatter: function(a, g) {
				g = g ? "footer" : "header";
				var k = a.series,
					e = k.tooltipOptions,
					b = e.xDateFormat,
					c = k.xAxis,
					h = c && "datetime" === c.options.type && d(a.key),
					l = e[g + "Format"];
				h && !b && (b = this.getXDateFormat(a, e, c));
				h && b && C(a.point && a.point.tooltipDateKeys || ["key"], function(a) {
					l = l.replace("{point." + a + "}", "{point." + a + ":" + b + "}")
				});
				return f(l, {
					point: a,
					series: k
				})
			},
			bodyFormatter: function(a) {
				return v(a, function(a) {
					var k = a.series.tooltipOptions;
					return(k[(a.point.formatPrefix || "point") + "Formatter"] || a.point.tooltipFormatter).call(a.point, k[(a.point.formatPrefix || "point") + "Format"])
				})
			}
		}
	})(K);
	(function(a) {
		var y = a.addEvent,
			C = a.attr,
			x = a.charts,
			f = a.color,
			d = a.css,
			v = a.defined,
			t = a.each,
			q = a.extend,
			n = a.find,
			l = a.fireEvent,
			g = a.isObject,
			r = a.offset,
			m = a.pick,
			k = a.splat,
			e = a.Tooltip;
		a.Pointer = function(a, c) {
			this.init(a, c)
		};
		a.Pointer.prototype = {
			init: function(a, c) {
				this.options = c;
				this.chart = a;
				this.runChartClick = c.chart.events && !!c.chart.events.click;
				this.pinchDown = [];
				this.lastValidTouch = {};
				e && (a.tooltip = new e(a, c.tooltip), this.followTouchMove = m(c.tooltip.followTouchMove, !0));
				this.setDOMEvents()
			},
			zoomOption: function(a) {
				var b =
					this.chart,
					h = b.options.chart,
					e = h.zoomType || "",
					b = b.inverted;
				/touch/.test(a.type) && (e = m(h.pinchType, e));
				this.zoomX = a = /x/.test(e);
				this.zoomY = e = /y/.test(e);
				this.zoomHor = a && !b || e && b;
				this.zoomVert = e && !b || a && b;
				this.hasZoom = a || e
			},
			normalize: function(a, c) {
				var b;
				b = a.touches ? a.touches.length ? a.touches.item(0) : a.changedTouches[0] : a;
				c || (this.chartPosition = c = r(this.chart.container));
				return q(a, {
					chartX: Math.round(b.pageX - c.left),
					chartY: Math.round(b.pageY - c.top)
				})
			},
			getCoordinates: function(a) {
				var b = {
					xAxis: [],
					yAxis: []
				};
				t(this.chart.axes, function(c) {
					b[c.isXAxis ? "xAxis" : "yAxis"].push({
						axis: c,
						value: c.toValue(a[c.horiz ? "chartX" : "chartY"])
					})
				});
				return b
			},
			findNearestKDPoint: function(a, c, h) {
				var b;
				t(a, function(a) {
					var e = !(a.noSharedTooltip && c) && 0 > a.options.findNearestPointBy.indexOf("y");
					a = a.searchPoint(h, e);
					if((e = g(a, !0)) && !(e = !g(b, !0))) var e = b.distX - a.distX,
						k = b.dist - a.dist,
						d = (a.series.group && a.series.group.zIndex) - (b.series.group && b.series.group.zIndex),
						e = 0 < (0 !== e && c ? e : 0 !== k ? k : 0 !== d ? d : b.series.index > a.series.index ? -1 : 1);
					e && (b = a)
				});
				return b
			},
			getPointFromEvent: function(a) {
				a = a.target;
				for(var b; a && !b;) b = a.point, a = a.parentNode;
				return b
			},
			getChartCoordinatesFromPoint: function(a, c) {
				var b = a.series,
					e = b.xAxis,
					b = b.yAxis,
					k = m(a.clientX, a.plotX);
				if(e && b) return c ? {
					chartX: e.len + e.pos - k,
					chartY: b.len + b.pos - a.plotY
				} : {
					chartX: k + e.pos,
					chartY: a.plotY + b.pos
				}
			},
			getHoverData: function(b, c, h, e, k, d, f) {
				var l, B = [],
					r = f && f.isBoosting;
				e = !(!e || !b);
				f = c && !c.stickyTracking ? [c] : a.grep(h, function(a) {
					return a.visible && !(!k && a.directTouch) && m(a.options.enableMouseTracking, !0) && a.stickyTracking
				});
				c = (l = e ? b : this.findNearestKDPoint(f, k, d)) && l.series;
				l && (k && !c.noSharedTooltip ? (f = a.grep(h, function(a) {
					return a.visible && !(!k && a.directTouch) && m(a.options.enableMouseTracking, !0) && !a.noSharedTooltip
				}), t(f, function(a) {
					var b = n(a.points, function(a) {
						return a.x === l.x && !a.isNull
					});
					g(b) && (r && (b = a.getPoint(b)), B.push(b))
				})) : B.push(l));
				return {
					hoverPoint: l,
					hoverSeries: c,
					hoverPoints: B
				}
			},
			runPointActions: function(b, c) {
				var h = this.chart,
					e = h.tooltip && h.tooltip.options.enabled ? h.tooltip : void 0,
					k = e ? e.shared : !1,
					g = c || h.hoverPoint,
					d = g && g.series || h.hoverSeries,
					d = this.getHoverData(g, d, h.series, !!c || d && d.directTouch && this.isDirectTouch, k, b, {
						isBoosting: h.isBoosting
					}),
					f, g = d.hoverPoint;
				f = d.hoverPoints;
				c = (d = d.hoverSeries) && d.tooltipOptions.followPointer;
				k = k && d && !d.noSharedTooltip;
				if(g && (g !== h.hoverPoint || e && e.isHidden)) {
					t(h.hoverPoints || [], function(b) {
						-1 === a.inArray(b, f) && b.setState()
					});
					t(f || [], function(a) {
						a.setState("hover")
					});
					if(h.hoverSeries !== d) d.onMouseOver();
					h.hoverPoint && h.hoverPoint.firePointEvent("mouseOut");
					if(!g.series) return;
					g.firePointEvent("mouseOver");
					h.hoverPoints = f;
					h.hoverPoint = g;
					e && e.refresh(k ? f : g, b)
				} else c && e && !e.isHidden && (g = e.getAnchor([{}], b), e.updatePosition({
					plotX: g[0],
					plotY: g[1]
				}));
				this.unDocMouseMove || (this.unDocMouseMove = y(h.container.ownerDocument, "mousemove", function(b) {
					var c = x[a.hoverChartIndex];
					if(c) c.pointer.onDocumentMouseMove(b)
				}));
				t(h.axes, function(c) {
					var h = m(c.crosshair.snap, !0),
						e = h ? a.find(f, function(a) {
							return a.series[c.coll] === c
						}) : void 0;
					e || !h ? c.drawCrosshair(b, e) : c.hideCrosshair()
				})
			},
			reset: function(a, c) {
				var b = this.chart,
					e = b.hoverSeries,
					g = b.hoverPoint,
					d = b.hoverPoints,
					f = b.tooltip,
					l = f && f.shared ? d : g;
				a && l && t(k(l), function(b) {
					b.series.isCartesian && void 0 === b.plotX && (a = !1)
				});
				if(a) f && l && (f.refresh(l), g && (g.setState(g.state, !0), t(b.axes, function(a) {
					a.crosshair && a.drawCrosshair(null, g)
				})));
				else {
					if(g) g.onMouseOut();
					d && t(d, function(a) {
						a.setState()
					});
					if(e) e.onMouseOut();
					f && f.hide(c);
					this.unDocMouseMove && (this.unDocMouseMove = this.unDocMouseMove());
					t(b.axes, function(a) {
						a.hideCrosshair()
					});
					this.hoverX =
						b.hoverPoints = b.hoverPoint = null
				}
			},
			scaleGroups: function(a, c) {
				var b = this.chart,
					e;
				t(b.series, function(h) {
					e = a || h.getPlotBox();
					h.xAxis && h.xAxis.zoomEnabled && h.group && (h.group.attr(e), h.markerGroup && (h.markerGroup.attr(e), h.markerGroup.clip(c ? b.clipRect : null)), h.dataLabelsGroup && h.dataLabelsGroup.attr(e))
				});
				b.clipRect.attr(c || b.clipBox)
			},
			dragStart: function(a) {
				var b = this.chart;
				b.mouseIsDown = a.type;
				b.cancelClick = !1;
				b.mouseDownX = this.mouseDownX = a.chartX;
				b.mouseDownY = this.mouseDownY = a.chartY
			},
			drag: function(a) {
				var b =
					this.chart,
					h = b.options.chart,
					e = a.chartX,
					k = a.chartY,
					g = this.zoomHor,
					d = this.zoomVert,
					l = b.plotLeft,
					m = b.plotTop,
					n = b.plotWidth,
					w = b.plotHeight,
					G, E = this.selectionMarker,
					r = this.mouseDownX,
					p = this.mouseDownY,
					u = h.panKey && a[h.panKey + "Key"];
				E && E.touch || (e < l ? e = l : e > l + n && (e = l + n), k < m ? k = m : k > m + w && (k = m + w), this.hasDragged = Math.sqrt(Math.pow(r - e, 2) + Math.pow(p - k, 2)), 10 < this.hasDragged && (G = b.isInsidePlot(r - l, p - m), b.hasCartesianSeries && (this.zoomX || this.zoomY) && G && !u && !E && (this.selectionMarker = E = b.renderer.rect(l, m, g ? 1 : n,
					d ? 1 : w, 0).attr({
					fill: h.selectionMarkerFill || f("#335cad").setOpacity(.25).get(),
					"class": "highcharts-selection-marker",
					zIndex: 7
				}).add()), E && g && (e -= r, E.attr({
					width: Math.abs(e),
					x: (0 < e ? 0 : e) + r
				})), E && d && (e = k - p, E.attr({
					height: Math.abs(e),
					y: (0 < e ? 0 : e) + p
				})), G && !E && h.panning && b.pan(a, h.panning)))
			},
			drop: function(a) {
				var b = this,
					e = this.chart,
					k = this.hasPinched;
				if(this.selectionMarker) {
					var g = {
							originalEvent: a,
							xAxis: [],
							yAxis: []
						},
						f = this.selectionMarker,
						m = f.attr ? f.attr("x") : f.x,
						n = f.attr ? f.attr("y") : f.y,
						r = f.attr ? f.attr("width") :
						f.width,
						N = f.attr ? f.attr("height") : f.height,
						w;
					if(this.hasDragged || k) t(e.axes, function(c) {
						if(c.zoomEnabled && v(c.min) && (k || b[{
								xAxis: "zoomX",
								yAxis: "zoomY"
							}[c.coll]])) {
							var e = c.horiz,
								h = "touchend" === a.type ? c.minPixelPadding : 0,
								d = c.toValue((e ? m : n) + h),
								e = c.toValue((e ? m + r : n + N) - h);
							g[c.coll].push({
								axis: c,
								min: Math.min(d, e),
								max: Math.max(d, e)
							});
							w = !0
						}
					}), w && l(e, "selection", g, function(a) {
						e.zoom(q(a, k ? {
							animation: !1
						} : null))
					});
					this.selectionMarker = this.selectionMarker.destroy();
					k && this.scaleGroups()
				}
				e && (d(e.container, {
						cursor: e._cursor
					}),
					e.cancelClick = 10 < this.hasDragged, e.mouseIsDown = this.hasDragged = this.hasPinched = !1, this.pinchDown = [])
			},
			onContainerMouseDown: function(a) {
				a = this.normalize(a);
				this.zoomOption(a);
				a.preventDefault && a.preventDefault();
				this.dragStart(a)
			},
			onDocumentMouseUp: function(b) {
				x[a.hoverChartIndex] && x[a.hoverChartIndex].pointer.drop(b)
			},
			onDocumentMouseMove: function(a) {
				var b = this.chart,
					e = this.chartPosition;
				a = this.normalize(a, e);
				!e || this.inClass(a.target, "highcharts-tracker") || b.isInsidePlot(a.chartX - b.plotLeft, a.chartY -
					b.plotTop) || this.reset()
			},
			onContainerMouseLeave: function(b) {
				var c = x[a.hoverChartIndex];
				c && (b.relatedTarget || b.toElement) && (c.pointer.reset(), c.pointer.chartPosition = null)
			},
			onContainerMouseMove: function(b) {
				var c = this.chart;
				v(a.hoverChartIndex) && x[a.hoverChartIndex] && x[a.hoverChartIndex].mouseIsDown || (a.hoverChartIndex = c.index);
				b = this.normalize(b);
				b.returnValue = !1;
				"mousedown" === c.mouseIsDown && this.drag(b);
				!this.inClass(b.target, "highcharts-tracker") && !c.isInsidePlot(b.chartX - c.plotLeft, b.chartY - c.plotTop) ||
					c.openMenu || this.runPointActions(b)
			},
			inClass: function(a, c) {
				for(var b; a;) {
					if(b = C(a, "class")) {
						if(-1 !== b.indexOf(c)) return !0;
						if(-1 !== b.indexOf("highcharts-container")) return !1
					}
					a = a.parentNode
				}
			},
			onTrackerMouseOut: function(a) {
				var b = this.chart.hoverSeries;
				a = a.relatedTarget || a.toElement;
				this.isDirectTouch = !1;
				if(!(!b || !a || b.stickyTracking || this.inClass(a, "highcharts-tooltip") || this.inClass(a, "highcharts-series-" + b.index) && this.inClass(a, "highcharts-tracker"))) b.onMouseOut()
			},
			onContainerClick: function(a) {
				var b =
					this.chart,
					e = b.hoverPoint,
					k = b.plotLeft,
					g = b.plotTop;
				a = this.normalize(a);
				b.cancelClick || (e && this.inClass(a.target, "highcharts-tracker") ? (l(e.series, "click", q(a, {
					point: e
				})), b.hoverPoint && e.firePointEvent("click", a)) : (q(a, this.getCoordinates(a)), b.isInsidePlot(a.chartX - k, a.chartY - g) && l(b, "click", a)))
			},
			setDOMEvents: function() {
				var b = this,
					c = b.chart.container,
					e = c.ownerDocument;
				c.onmousedown = function(a) {
					b.onContainerMouseDown(a)
				};
				c.onmousemove = function(a) {
					b.onContainerMouseMove(a)
				};
				c.onclick = function(a) {
					b.onContainerClick(a)
				};
				this.unbindContainerMouseLeave = y(c, "mouseleave", b.onContainerMouseLeave);
				a.unbindDocumentMouseUp || (a.unbindDocumentMouseUp = y(e, "mouseup", b.onDocumentMouseUp));
				a.hasTouch && (c.ontouchstart = function(a) {
					b.onContainerTouchStart(a)
				}, c.ontouchmove = function(a) {
					b.onContainerTouchMove(a)
				}, a.unbindDocumentTouchEnd || (a.unbindDocumentTouchEnd = y(e, "touchend", b.onDocumentTouchEnd)))
			},
			destroy: function() {
				var b = this;
				b.unDocMouseMove && b.unDocMouseMove();
				this.unbindContainerMouseLeave();
				a.chartCount || (a.unbindDocumentMouseUp &&
					(a.unbindDocumentMouseUp = a.unbindDocumentMouseUp()), a.unbindDocumentTouchEnd && (a.unbindDocumentTouchEnd = a.unbindDocumentTouchEnd()));
				clearInterval(b.tooltipTimeout);
				a.objectEach(b, function(a, e) {
					b[e] = null
				})
			}
		}
	})(K);
	(function(a) {
		var y = a.charts,
			C = a.each,
			x = a.extend,
			f = a.map,
			d = a.noop,
			v = a.pick;
		x(a.Pointer.prototype, {
			pinchTranslate: function(a, d, f, l, g, r) {
				this.zoomHor && this.pinchTranslateDirection(!0, a, d, f, l, g, r);
				this.zoomVert && this.pinchTranslateDirection(!1, a, d, f, l, g, r)
			},
			pinchTranslateDirection: function(a,
				d, f, l, g, r, m, k) {
				var e = this.chart,
					b = a ? "x" : "y",
					c = a ? "X" : "Y",
					h = "chart" + c,
					n = a ? "width" : "height",
					q = e["plot" + (a ? "Left" : "Top")],
					B, t, F = k || 1,
					z = e.inverted,
					v = e.bounds[a ? "h" : "v"],
					w = 1 === d.length,
					G = d[0][h],
					E = f[0][h],
					H = !w && d[1][h],
					p = !w && f[1][h],
					u;
				f = function() {
					!w && 20 < Math.abs(G - H) && (F = k || Math.abs(E - p) / Math.abs(G - H));
					t = (q - E) / F + G;
					B = e["plot" + (a ? "Width" : "Height")] / F
				};
				f();
				d = t;
				d < v.min ? (d = v.min, u = !0) : d + B > v.max && (d = v.max - B, u = !0);
				u ? (E -= .8 * (E - m[b][0]), w || (p -= .8 * (p - m[b][1])), f()) : m[b] = [E, p];
				z || (r[b] = t - q, r[n] = B);
				r = z ? 1 / F : F;
				g[n] =
					B;
				g[b] = d;
				l[z ? a ? "scaleY" : "scaleX" : "scale" + c] = F;
				l["translate" + c] = r * q + (E - r * G)
			},
			pinch: function(a) {
				var q = this,
					n = q.chart,
					l = q.pinchDown,
					g = a.touches,
					r = g.length,
					m = q.lastValidTouch,
					k = q.hasZoom,
					e = q.selectionMarker,
					b = {},
					c = 1 === r && (q.inClass(a.target, "highcharts-tracker") && n.runTrackerClick || q.runChartClick),
					h = {};
				1 < r && (q.initiated = !0);
				k && q.initiated && !c && a.preventDefault();
				f(g, function(a) {
					return q.normalize(a)
				});
				"touchstart" === a.type ? (C(g, function(a, b) {
					l[b] = {
						chartX: a.chartX,
						chartY: a.chartY
					}
				}), m.x = [l[0].chartX,
					l[1] && l[1].chartX
				], m.y = [l[0].chartY, l[1] && l[1].chartY], C(n.axes, function(a) {
					if(a.zoomEnabled) {
						var b = n.bounds[a.horiz ? "h" : "v"],
							c = a.minPixelPadding,
							e = a.toPixels(v(a.options.min, a.dataMin)),
							h = a.toPixels(v(a.options.max, a.dataMax)),
							k = Math.max(e, h);
						b.min = Math.min(a.pos, Math.min(e, h) - c);
						b.max = Math.max(a.pos + a.len, k + c)
					}
				}), q.res = !0) : q.followTouchMove && 1 === r ? this.runPointActions(q.normalize(a)) : l.length && (e || (q.selectionMarker = e = x({
						destroy: d,
						touch: !0
					}, n.plotBox)), q.pinchTranslate(l, g, b, e, h, m), q.hasPinched =
					k, q.scaleGroups(b, h), q.res && (q.res = !1, this.reset(!1, 0)))
			},
			touch: function(d, f) {
				var n = this.chart,
					l, g;
				if(n.index !== a.hoverChartIndex) this.onContainerMouseLeave({
					relatedTarget: !0
				});
				a.hoverChartIndex = n.index;
				1 === d.touches.length ? (d = this.normalize(d), (g = n.isInsidePlot(d.chartX - n.plotLeft, d.chartY - n.plotTop)) && !n.openMenu ? (f && this.runPointActions(d), "touchmove" === d.type && (f = this.pinchDown, l = f[0] ? 4 <= Math.sqrt(Math.pow(f[0].chartX - d.chartX, 2) + Math.pow(f[0].chartY - d.chartY, 2)) : !1), v(l, !0) && this.pinch(d)) : f &&
					this.reset()) : 2 === d.touches.length && this.pinch(d)
			},
			onContainerTouchStart: function(a) {
				this.zoomOption(a);
				this.touch(a, !0)
			},
			onContainerTouchMove: function(a) {
				this.touch(a)
			},
			onDocumentTouchEnd: function(d) {
				y[a.hoverChartIndex] && y[a.hoverChartIndex].pointer.drop(d)
			}
		})
	})(K);
	(function(a) {
		var y = a.addEvent,
			C = a.charts,
			x = a.css,
			f = a.doc,
			d = a.extend,
			v = a.noop,
			t = a.Pointer,
			q = a.removeEvent,
			n = a.win,
			l = a.wrap;
		if(!a.hasTouch && (n.PointerEvent || n.MSPointerEvent)) {
			var g = {},
				r = !!n.PointerEvent,
				m = function() {
					var e = [];
					e.item = function(a) {
						return this[a]
					};
					a.objectEach(g, function(a) {
						e.push({
							pageX: a.pageX,
							pageY: a.pageY,
							target: a.target
						})
					});
					return e
				},
				k = function(e, b, c, h) {
					"touch" !== e.pointerType && e.pointerType !== e.MSPOINTER_TYPE_TOUCH || !C[a.hoverChartIndex] || (h(e), h = C[a.hoverChartIndex].pointer, h[b]({
						type: c,
						target: e.currentTarget,
						preventDefault: v,
						touches: m()
					}))
				};
			d(t.prototype, {
				onContainerPointerDown: function(a) {
					k(a, "onContainerTouchStart", "touchstart", function(a) {
						g[a.pointerId] = {
							pageX: a.pageX,
							pageY: a.pageY,
							target: a.currentTarget
						}
					})
				},
				onContainerPointerMove: function(a) {
					k(a,
						"onContainerTouchMove", "touchmove",
						function(a) {
							g[a.pointerId] = {
								pageX: a.pageX,
								pageY: a.pageY
							};
							g[a.pointerId].target || (g[a.pointerId].target = a.currentTarget)
						})
				},
				onDocumentPointerUp: function(a) {
					k(a, "onDocumentTouchEnd", "touchend", function(a) {
						delete g[a.pointerId]
					})
				},
				batchMSEvents: function(a) {
					a(this.chart.container, r ? "pointerdown" : "MSPointerDown", this.onContainerPointerDown);
					a(this.chart.container, r ? "pointermove" : "MSPointerMove", this.onContainerPointerMove);
					a(f, r ? "pointerup" : "MSPointerUp", this.onDocumentPointerUp)
				}
			});
			l(t.prototype, "init", function(a, b, c) {
				a.call(this, b, c);
				this.hasZoom && x(b.container, {
					"-ms-touch-action": "none",
					"touch-action": "none"
				})
			});
			l(t.prototype, "setDOMEvents", function(a) {
				a.apply(this);
				(this.hasZoom || this.followTouchMove) && this.batchMSEvents(y)
			});
			l(t.prototype, "destroy", function(a) {
				this.batchMSEvents(q);
				a.call(this)
			})
		}
	})(K);
	(function(a) {
		var y = a.addEvent,
			C = a.css,
			x = a.discardElement,
			f = a.defined,
			d = a.each,
			v = a.isFirefox,
			t = a.marginNames,
			q = a.merge,
			n = a.pick,
			l = a.setAnimation,
			g = a.stableSort,
			r = a.win,
			m = a.wrap;
		a.Legend = function(a, e) {
			this.init(a, e)
		};
		a.Legend.prototype = {
			init: function(a, e) {
				this.chart = a;
				this.setOptions(e);
				e.enabled && (this.render(), y(this.chart, "endResize", function() {
					this.legend.positionCheckboxes()
				}))
			},
			setOptions: function(a) {
				var e = n(a.padding, 8);
				this.options = a;
				this.itemStyle = a.itemStyle;
				this.itemHiddenStyle = q(this.itemStyle, a.itemHiddenStyle);
				this.itemMarginTop = a.itemMarginTop || 0;
				this.padding = e;
				this.initialItemY = e - 5;
				this.itemHeight = this.maxItemWidth = 0;
				this.symbolWidth = n(a.symbolWidth, 16);
				this.pages = []
			},
			update: function(a, e) {
				var b = this.chart;
				this.setOptions(q(!0, this.options, a));
				this.destroy();
				b.isDirtyLegend = b.isDirtyBox = !0;
				n(e, !0) && b.redraw()
			},
			colorizeItem: function(a, e) {
				a.legendGroup[e ? "removeClass" : "addClass"]("highcharts-legend-item-hidden");
				var b = this.options,
					c = a.legendItem,
					h = a.legendLine,
					g = a.legendSymbol,
					k = this.itemHiddenStyle.color,
					b = e ? b.itemStyle.color : k,
					d = e ? a.color || k : k,
					f = a.options && a.options.marker,
					l = {
						fill: d
					};
				c && c.css({
					fill: b,
					color: b
				});
				h && h.attr({
					stroke: d
				});
				g && (f && g.isMarker && (l = a.pointAttribs(),
					e || (l.stroke = l.fill = k)), g.attr(l))
			},
			positionItem: function(a) {
				var e = this.options,
					b = e.symbolPadding,
					e = !e.rtl,
					c = a._legendItemPos,
					h = c[0],
					c = c[1],
					g = a.checkbox;
				(a = a.legendGroup) && a.element && a.translate(e ? h : this.legendWidth - h - 2 * b - 4, c);
				g && (g.x = h, g.y = c)
			},
			destroyItem: function(a) {
				var e = a.checkbox;
				d(["legendItem", "legendLine", "legendSymbol", "legendGroup"], function(b) {
					a[b] && (a[b] = a[b].destroy())
				});
				e && x(a.checkbox)
			},
			destroy: function() {
				function a(a) {
					this[a] && (this[a] = this[a].destroy())
				}
				d(this.getAllItems(), function(e) {
					d(["legendItem",
						"legendGroup"
					], a, e)
				});
				d("clipRect up down pager nav box title group".split(" "), a, this);
				this.display = null
			},
			positionCheckboxes: function() {
				var a = this.group && this.group.alignAttr,
					e, b = this.clipHeight || this.legendHeight,
					c = this.titleHeight;
				a && (e = a.translateY, d(this.allItems, function(h) {
					var g = h.checkbox,
						k;
					g && (k = e + c + g.y + (this.scrollOffset || 0) + 3, C(g, {
						left: a.translateX + h.checkboxOffset + g.x - 20 + "px",
						top: k + "px",
						display: k > e - 6 && k < e + b - 6 ? "" : "none"
					}))
				}, this))
			},
			renderTitle: function() {
				var a = this.options,
					e = this.padding,
					b = a.title,
					c = 0;
				b.text && (this.title || (this.title = this.chart.renderer.label(b.text, e - 3, e - 4, null, null, null, a.useHTML, null, "legend-title").attr({
					zIndex: 1
				}).css(b.style).add(this.group)), a = this.title.getBBox(), c = a.height, this.offsetWidth = a.width, this.contentGroup.attr({
					translateY: c
				}));
				this.titleHeight = c
			},
			setText: function(g) {
				var e = this.options;
				g.legendItem.attr({
					text: e.labelFormat ? a.format(e.labelFormat, g) : e.labelFormatter.call(g)
				})
			},
			renderItem: function(a) {
				var e = this.chart,
					b = e.renderer,
					c = this.options,
					h =
					"horizontal" === c.layout,
					g = this.symbolWidth,
					d = c.symbolPadding,
					k = this.itemStyle,
					f = this.itemHiddenStyle,
					l = this.padding,
					m = h ? n(c.itemDistance, 20) : 0,
					r = !c.rtl,
					w = c.width,
					G = c.itemMarginBottom || 0,
					E = this.itemMarginTop,
					H = a.legendItem,
					p = !a.series,
					u = !p && a.series.drawLegendSymbol ? a.series : a,
					v = u.options,
					t = this.createCheckboxForItem && v && v.showCheckbox,
					v = g + d + m + (t ? 20 : 0),
					O = c.useHTML,
					L = a.options.className;
				H || (a.legendGroup = b.g("legend-item").addClass("highcharts-" + u.type + "-series highcharts-color-" + a.colorIndex + (L ? " " +
					L : "") + (p ? " highcharts-series-" + a.index : "")).attr({
					zIndex: 1
				}).add(this.scrollGroup), a.legendItem = H = b.text("", r ? g + d : -d, this.baseline || 0, O).css(q(a.visible ? k : f)).attr({
					align: r ? "left" : "right",
					zIndex: 2
				}).add(a.legendGroup), this.baseline || (g = k.fontSize, this.fontMetrics = b.fontMetrics(g, H), this.baseline = this.fontMetrics.f + 3 + E, H.attr("y", this.baseline)), this.symbolHeight = c.symbolHeight || this.fontMetrics.f, u.drawLegendSymbol(this, a), this.setItemEvents && this.setItemEvents(a, H, O), t && this.createCheckboxForItem(a));
				this.colorizeItem(a, a.visible);
				k.width || H.css({
					width: (c.itemWidth || c.width || e.spacingBox.width) - v
				});
				this.setText(a);
				b = H.getBBox();
				k = a.checkboxOffset = c.itemWidth || a.legendItemWidth || b.width + v;
				this.itemHeight = b = Math.round(a.legendItemHeight || b.height || this.symbolHeight);
				h && this.itemX - l + k > (w || e.spacingBox.width - 2 * l - c.x) && (this.itemX = l, this.itemY += E + this.lastLineHeight + G, this.lastLineHeight = 0);
				this.maxItemWidth = Math.max(this.maxItemWidth, k);
				this.lastItemY = E + this.itemY + G;
				this.lastLineHeight = Math.max(b,
					this.lastLineHeight);
				a._legendItemPos = [this.itemX, this.itemY];
				h ? this.itemX += k : (this.itemY += E + b + G, this.lastLineHeight = b);
				this.offsetWidth = w || Math.max((h ? this.itemX - l - (a.checkbox ? 0 : m) : k) + l, this.offsetWidth)
			},
			getAllItems: function() {
				var a = [];
				d(this.chart.series, function(e) {
					var b = e && e.options;
					e && n(b.showInLegend, f(b.linkedTo) ? !1 : void 0, !0) && (a = a.concat(e.legendItems || ("point" === b.legendType ? e.data : e)))
				});
				return a
			},
			adjustMargins: function(a, e) {
				var b = this.chart,
					c = this.options,
					h = c.align.charAt(0) + c.verticalAlign.charAt(0) +
					c.layout.charAt(0);
				c.floating || d([/(lth|ct|rth)/, /(rtv|rm|rbv)/, /(rbh|cb|lbh)/, /(lbv|lm|ltv)/], function(g, d) {
					g.test(h) && !f(a[d]) && (b[t[d]] = Math.max(b[t[d]], b.legend[(d + 1) % 2 ? "legendHeight" : "legendWidth"] + [1, -1, -1, 1][d] * c[d % 2 ? "x" : "y"] + n(c.margin, 12) + e[d]))
				})
			},
			render: function() {
				var a = this,
					e = a.chart,
					b = e.renderer,
					c = a.group,
					h, f, l, m, n = a.box,
					r = a.options,
					z = a.padding;
				a.itemX = z;
				a.itemY = a.initialItemY;
				a.offsetWidth = 0;
				a.lastItemY = 0;
				c || (a.group = c = b.g("legend").attr({
						zIndex: 7
					}).add(), a.contentGroup = b.g().attr({
						zIndex: 1
					}).add(c),
					a.scrollGroup = b.g().add(a.contentGroup));
				a.renderTitle();
				h = a.getAllItems();
				g(h, function(a, b) {
					return(a.options && a.options.legendIndex || 0) - (b.options && b.options.legendIndex || 0)
				});
				r.reversed && h.reverse();
				a.allItems = h;
				a.display = f = !!h.length;
				a.lastLineHeight = 0;
				d(h, function(b) {
					a.renderItem(b)
				});
				l = (r.width || a.offsetWidth) + z;
				m = a.lastItemY + a.lastLineHeight + a.titleHeight;
				m = a.handleOverflow(m);
				m += z;
				n || (a.box = n = b.rect().addClass("highcharts-legend-box").attr({
					r: r.borderRadius
				}).add(c), n.isNew = !0);
				n.attr({
					stroke: r.borderColor,
					"stroke-width": r.borderWidth || 0,
					fill: r.backgroundColor || "none"
				}).shadow(r.shadow);
				0 < l && 0 < m && (n[n.isNew ? "attr" : "animate"](n.crisp.call({}, {
					x: 0,
					y: 0,
					width: l,
					height: m
				}, n.strokeWidth())), n.isNew = !1);
				n[f ? "show" : "hide"]();
				a.legendWidth = l;
				a.legendHeight = m;
				d(h, function(b) {
					a.positionItem(b)
				});
				f && c.align(q(r, {
					width: l,
					height: m
				}), !0, "spacingBox");
				e.isResizing || this.positionCheckboxes()
			},
			handleOverflow: function(a) {
				var e = this,
					b = this.chart,
					c = b.renderer,
					h = this.options,
					g = h.y,
					f = this.padding,
					b = b.spacingBox.height + ("top" ===
						h.verticalAlign ? -g : g) - f,
					g = h.maxHeight,
					k, l = this.clipRect,
					m = h.navigation,
					r = n(m.animation, !0),
					q = m.arrowSize || 12,
					w = this.nav,
					G = this.pages,
					E, H = this.allItems,
					p = function(a) {
						"number" === typeof a ? l.attr({
							height: a
						}) : l && (e.clipRect = l.destroy(), e.contentGroup.clip());
						e.contentGroup.div && (e.contentGroup.div.style.clip = a ? "rect(" + f + "px,9999px," + (f + a) + "px,0)" : "auto")
					};
				"horizontal" !== h.layout || "middle" === h.verticalAlign || h.floating || (b /= 2);
				g && (b = Math.min(b, g));
				G.length = 0;
				a > b && !1 !== m.enabled ? (this.clipHeight = k = Math.max(b -
					20 - this.titleHeight - f, 0), this.currentPage = n(this.currentPage, 1), this.fullHeight = a, d(H, function(a, b) {
					var c = a._legendItemPos[1];
					a = Math.round(a.legendItem.getBBox().height);
					var e = G.length;
					if(!e || c - G[e - 1] > k && (E || c) !== G[e - 1]) G.push(E || c), e++;
					b === H.length - 1 && c + a - G[e - 1] > k && G.push(c);
					c !== E && (E = c)
				}), l || (l = e.clipRect = c.clipRect(0, f, 9999, 0), e.contentGroup.clip(l)), p(k), w || (this.nav = w = c.g().attr({
						zIndex: 1
					}).add(this.group), this.up = c.symbol("triangle", 0, 0, q, q).on("click", function() {
						e.scroll(-1, r)
					}).add(w), this.pager =
					c.text("", 15, 10).addClass("highcharts-legend-navigation").css(m.style).add(w), this.down = c.symbol("triangle-down", 0, 0, q, q).on("click", function() {
						e.scroll(1, r)
					}).add(w)), e.scroll(0), a = b) : w && (p(), this.nav = w.destroy(), this.scrollGroup.attr({
					translateY: 1
				}), this.clipHeight = 0);
				return a
			},
			scroll: function(a, e) {
				var b = this.pages,
					c = b.length;
				a = this.currentPage + a;
				var h = this.clipHeight,
					g = this.options.navigation,
					d = this.pager,
					f = this.padding;
				a > c && (a = c);
				0 < a && (void 0 !== e && l(e, this.chart), this.nav.attr({
					translateX: f,
					translateY: h +
						this.padding + 7 + this.titleHeight,
					visibility: "visible"
				}), this.up.attr({
					"class": 1 === a ? "highcharts-legend-nav-inactive" : "highcharts-legend-nav-active"
				}), d.attr({
					text: a + "/" + c
				}), this.down.attr({
					x: 18 + this.pager.getBBox().width,
					"class": a === c ? "highcharts-legend-nav-inactive" : "highcharts-legend-nav-active"
				}), this.up.attr({
					fill: 1 === a ? g.inactiveColor : g.activeColor
				}).css({
					cursor: 1 === a ? "default" : "pointer"
				}), this.down.attr({
					fill: a === c ? g.inactiveColor : g.activeColor
				}).css({
					cursor: a === c ? "default" : "pointer"
				}), this.scrollOffset = -b[a - 1] + this.initialItemY, this.scrollGroup.animate({
					translateY: this.scrollOffset
				}), this.currentPage = a, this.positionCheckboxes())
			}
		};
		a.LegendSymbolMixin = {
			drawRectangle: function(a, e) {
				var b = a.symbolHeight,
					c = a.options.squareSymbol;
				e.legendSymbol = this.chart.renderer.rect(c ? (a.symbolWidth - b) / 2 : 0, a.baseline - b + 1, c ? b : a.symbolWidth, b, n(a.options.symbolRadius, b / 2)).addClass("highcharts-point").attr({
					zIndex: 3
				}).add(e.legendGroup)
			},
			drawLineMarker: function(a) {
				var e = this.options,
					b = e.marker,
					c = a.symbolWidth,
					h = a.symbolHeight,
					g = h / 2,
					d = this.chart.renderer,
					f = this.legendGroup;
				a = a.baseline - Math.round(.3 * a.fontMetrics.b);
				var k;
				k = {
					"stroke-width": e.lineWidth || 0
				};
				e.dashStyle && (k.dashstyle = e.dashStyle);
				this.legendLine = d.path(["M", 0, a, "L", c, a]).addClass("highcharts-graph").attr(k).add(f);
				b && !1 !== b.enabled && (e = Math.min(n(b.radius, g), g), 0 === this.symbol.indexOf("url") && (b = q(b, {
					width: h,
					height: h
				}), e = 0), this.legendSymbol = b = d.symbol(this.symbol, c / 2 - e, a - e, 2 * e, 2 * e, b).addClass("highcharts-point").add(f), b.isMarker = !0)
			}
		};
		(/Trident\/7\.0/.test(r.navigator.userAgent) ||
			v) && m(a.Legend.prototype, "positionItem", function(a, e) {
			var b = this,
				c = function() {
					e._legendItemPos && a.call(b, e)
				};
			c();
			setTimeout(c)
		})
	})(K);
	(function(a) {
		var y = a.addEvent,
			C = a.animate,
			x = a.animObject,
			f = a.attr,
			d = a.doc,
			v = a.Axis,
			t = a.createElement,
			q = a.defaultOptions,
			n = a.discardElement,
			l = a.charts,
			g = a.css,
			r = a.defined,
			m = a.each,
			k = a.extend,
			e = a.find,
			b = a.fireEvent,
			c = a.grep,
			h = a.isNumber,
			D = a.isObject,
			I = a.isString,
			B = a.Legend,
			J = a.marginNames,
			F = a.merge,
			z = a.objectEach,
			N = a.Pointer,
			w = a.pick,
			G = a.pInt,
			E = a.removeEvent,
			H = a.seriesTypes,
			p = a.splat,
			u = a.svg,
			Q = a.syncTimeout,
			M = a.win,
			O = a.Chart = function() {
				this.getArgs.apply(this, arguments)
			};
		a.chart = function(a, b, c) {
			return new O(a, b, c)
		};
		k(O.prototype, {
			callbacks: [],
			getArgs: function() {
				var a = [].slice.call(arguments);
				if(I(a[0]) || a[0].nodeName) this.renderTo = a.shift();
				this.init(a[0], a[1])
			},
			init: function(b, c) {
				var e, h, g = b.series,
					d = b.plotOptions || {};
				b.series = null;
				e = F(q, b);
				for(h in e.plotOptions) e.plotOptions[h].tooltip = d[h] && F(d[h].tooltip) || void 0;
				e.tooltip.userOptions = b.chart && b.chart.forExport &&
					b.tooltip.userOptions || b.tooltip;
				e.series = b.series = g;
				this.userOptions = b;
				b = e.chart;
				h = b.events;
				this.margin = [];
				this.spacing = [];
				this.bounds = {
					h: {},
					v: {}
				};
				this.labelCollectors = [];
				this.callback = c;
				this.isResizing = 0;
				this.options = e;
				this.axes = [];
				this.series = [];
				this.hasCartesianSeries = b.showAxes;
				var f = this;
				f.index = l.length;
				l.push(f);
				a.chartCount++;
				h && z(h, function(a, b) {
					y(f, b, a)
				});
				f.xAxis = [];
				f.yAxis = [];
				f.pointCount = f.colorCounter = f.symbolCounter = 0;
				f.firstRender()
			},
			initSeries: function(b) {
				var c = this.options.chart;
				(c = H[b.type || c.type || c.defaultSeriesType]) || a.error(17, !0);
				c = new c;
				c.init(this, b);
				return c
			},
			orderSeries: function(a) {
				var b = this.series;
				for(a = a || 0; a < b.length; a++) b[a] && (b[a].index = a, b[a].name = b[a].name || "Series " + (b[a].index + 1))
			},
			isInsidePlot: function(a, b, c) {
				var e = c ? b : a;
				a = c ? a : b;
				return 0 <= e && e <= this.plotWidth && 0 <= a && a <= this.plotHeight
			},
			redraw: function(c) {
				var e = this.axes,
					h = this.series,
					g = this.pointer,
					d = this.legend,
					f = this.isDirtyLegend,
					p, w, l = this.hasCartesianSeries,
					u = this.isDirtyBox,
					G, E = this.renderer,
					n =
					E.isHidden(),
					r = [];
				this.setResponsive && this.setResponsive(!1);
				a.setAnimation(c, this);
				n && this.temporaryDisplay();
				this.layOutTitles();
				for(c = h.length; c--;)
					if(G = h[c], G.options.stacking && (p = !0, G.isDirty)) {
						w = !0;
						break
					}
				if(w)
					for(c = h.length; c--;) G = h[c], G.options.stacking && (G.isDirty = !0);
				m(h, function(a) {
					a.isDirty && "point" === a.options.legendType && (a.updateTotals && a.updateTotals(), f = !0);
					a.isDirtyData && b(a, "updatedData")
				});
				f && d.options.enabled && (d.render(), this.isDirtyLegend = !1);
				p && this.getStacks();
				l && m(e, function(a) {
					a.updateNames();
					a.setScale()
				});
				this.getMargins();
				l && (m(e, function(a) {
					a.isDirty && (u = !0)
				}), m(e, function(a) {
					var c = a.min + "," + a.max;
					a.extKey !== c && (a.extKey = c, r.push(function() {
						b(a, "afterSetExtremes", k(a.eventArgs, a.getExtremes()));
						delete a.eventArgs
					}));
					(u || p) && a.redraw()
				}));
				u && this.drawChartBox();
				b(this, "predraw");
				m(h, function(a) {
					(u || a.isDirty) && a.visible && a.redraw();
					a.isDirtyData = !1
				});
				g && g.reset(!0);
				E.draw();
				b(this, "redraw");
				b(this, "render");
				n && this.temporaryDisplay(!0);
				m(r, function(a) {
					a.call()
				})
			},
			get: function(a) {
				function b(b) {
					return b.id ===
						a || b.options && b.options.id === a
				}
				var c, h = this.series,
					g;
				c = e(this.axes, b) || e(this.series, b);
				for(g = 0; !c && g < h.length; g++) c = e(h[g].points || [], b);
				return c
			},
			getAxes: function() {
				var a = this,
					b = this.options,
					c = b.xAxis = p(b.xAxis || {}),
					b = b.yAxis = p(b.yAxis || {});
				m(c, function(a, b) {
					a.index = b;
					a.isX = !0
				});
				m(b, function(a, b) {
					a.index = b
				});
				c = c.concat(b);
				m(c, function(b) {
					new v(a, b)
				})
			},
			getSelectedPoints: function() {
				var a = [];
				m(this.series, function(b) {
					a = a.concat(c(b.data || [], function(a) {
						return a.selected
					}))
				});
				return a
			},
			getSelectedSeries: function() {
				return c(this.series,
					function(a) {
						return a.selected
					})
			},
			setTitle: function(a, b, c) {
				var e = this,
					h = e.options,
					g;
				g = h.title = F({
					style: {
						color: "#333333",
						fontSize: h.isStock ? "16px" : "18px"
					}
				}, h.title, a);
				h = h.subtitle = F({
					style: {
						color: "#666666"
					}
				}, h.subtitle, b);
				m([
					["title", a, g],
					["subtitle", b, h]
				], function(a, b) {
					var c = a[0],
						h = e[c],
						g = a[1];
					a = a[2];
					h && g && (e[c] = h = h.destroy());
					a && !h && (e[c] = e.renderer.text(a.text, 0, 0, a.useHTML).attr({
						align: a.align,
						"class": "highcharts-" + c,
						zIndex: a.zIndex || 4
					}).add(), e[c].update = function(a) {
						e.setTitle(!b && a, b && a)
					}, e[c].css(a.style))
				});
				e.layOutTitles(c)
			},
			layOutTitles: function(a) {
				var b = 0,
					c, e = this.renderer,
					h = this.spacingBox;
				m(["title", "subtitle"], function(a) {
					var c = this[a],
						g = this.options[a];
					a = "title" === a ? -3 : g.verticalAlign ? 0 : b + 2;
					var d;
					c && (d = g.style.fontSize, d = e.fontMetrics(d, c).b, c.css({
						width: (g.width || h.width + g.widthAdjust) + "px"
					}).align(k({
						y: a + d
					}, g), !1, "spacingBox"), g.floating || g.verticalAlign || (b = Math.ceil(b + c.getBBox(g.useHTML).height)))
				}, this);
				c = this.titleOffset !== b;
				this.titleOffset = b;
				!this.isDirtyBox && c && (this.isDirtyBox = c, this.hasRendered &&
					w(a, !0) && this.isDirtyBox && this.redraw())
			},
			getChartSize: function() {
				var b = this.options.chart,
					c = b.width,
					b = b.height,
					e = this.renderTo;
				r(c) || (this.containerWidth = a.getStyle(e, "width"));
				r(b) || (this.containerHeight = a.getStyle(e, "height"));
				this.chartWidth = Math.max(0, c || this.containerWidth || 600);
				this.chartHeight = Math.max(0, a.relativeLength(b, this.chartWidth) || (1 < this.containerHeight ? this.containerHeight : 400))
			},
			temporaryDisplay: function(b) {
				var c = this.renderTo;
				if(b)
					for(; c && c.style;) c.hcOrigStyle && (a.css(c, c.hcOrigStyle),
						delete c.hcOrigStyle), c.hcOrigDetached && (d.body.removeChild(c), c.hcOrigDetached = !1), c = c.parentNode;
				else
					for(; c && c.style;) {
						d.body.contains(c) || c.parentNode || (c.hcOrigDetached = !0, d.body.appendChild(c));
						if("none" === a.getStyle(c, "display", !1) || c.hcOricDetached) c.hcOrigStyle = {
							display: c.style.display,
							height: c.style.height,
							overflow: c.style.overflow
						}, b = {
							display: "block",
							overflow: "hidden"
						}, c !== this.renderTo && (b.height = 0), a.css(c, b), c.offsetWidth || c.style.setProperty("display", "block", "important");
						c = c.parentNode;
						if(c === d.body) break
					}
			},
			setClassName: function(a) {
				this.container.className = "highcharts-container " + (a || "")
			},
			getContainer: function() {
				var b, c = this.options,
					e = c.chart,
					g, p;
				b = this.renderTo;
				var w = a.uniqueKey(),
					u;
				b || (this.renderTo = b = e.renderTo);
				I(b) && (this.renderTo = b = d.getElementById(b));
				b || a.error(13, !0);
				g = G(f(b, "data-highcharts-chart"));
				h(g) && l[g] && l[g].hasRendered && l[g].destroy();
				f(b, "data-highcharts-chart", this.index);
				b.innerHTML = "";
				e.skipClone || b.offsetWidth || this.temporaryDisplay();
				this.getChartSize();
				g = this.chartWidth;
				p = this.chartHeight;
				u = k({
					position: "relative",
					overflow: "hidden",
					width: g + "px",
					height: p + "px",
					textAlign: "left",
					lineHeight: "normal",
					zIndex: 0,
					"-webkit-tap-highlight-color": "rgba(0,0,0,0)"
				}, e.style);
				this.container = b = t("div", {
					id: w
				}, u, b);
				this._cursor = b.style.cursor;
				this.renderer = new(a[e.renderer] || a.Renderer)(b, g, p, null, e.forExport, c.exporting && c.exporting.allowHTML);
				this.setClassName(e.className);
				this.renderer.setStyle(e.style);
				this.renderer.chartIndex = this.index
			},
			getMargins: function(a) {
				var b =
					this.spacing,
					c = this.margin,
					e = this.titleOffset;
				this.resetMargins();
				e && !r(c[0]) && (this.plotTop = Math.max(this.plotTop, e + this.options.title.margin + b[0]));
				this.legend && this.legend.display && this.legend.adjustMargins(c, b);
				this.extraMargin && (this[this.extraMargin.type] = (this[this.extraMargin.type] || 0) + this.extraMargin.value);
				this.adjustPlotArea && this.adjustPlotArea();
				a || this.getAxisMargins()
			},
			getAxisMargins: function() {
				var a = this,
					b = a.axisOffset = [0, 0, 0, 0],
					c = a.margin;
				a.hasCartesianSeries && m(a.axes, function(a) {
					a.visible &&
						a.getOffset()
				});
				m(J, function(e, h) {
					r(c[h]) || (a[e] += b[h])
				});
				a.setChartSize()
			},
			reflow: function(b) {
				var c = this,
					e = c.options.chart,
					h = c.renderTo,
					g = r(e.width) && r(e.height),
					f = e.width || a.getStyle(h, "width"),
					e = e.height || a.getStyle(h, "height"),
					h = b ? b.target : M;
				if(!g && !c.isPrinting && f && e && (h === M || h === d)) {
					if(f !== c.containerWidth || e !== c.containerHeight) clearTimeout(c.reflowTimeout), c.reflowTimeout = Q(function() {
						c.container && c.setSize(void 0, void 0, !1)
					}, b ? 100 : 0);
					c.containerWidth = f;
					c.containerHeight = e
				}
			},
			initReflow: function() {
				var a =
					this,
					b;
				b = y(M, "resize", function(b) {
					a.reflow(b)
				});
				y(a, "destroy", b)
			},
			setSize: function(c, e, h) {
				var d = this,
					f = d.renderer;
				d.isResizing += 1;
				a.setAnimation(h, d);
				d.oldChartHeight = d.chartHeight;
				d.oldChartWidth = d.chartWidth;
				void 0 !== c && (d.options.chart.width = c);
				void 0 !== e && (d.options.chart.height = e);
				d.getChartSize();
				c = f.globalAnimation;
				(c ? C : g)(d.container, {
					width: d.chartWidth + "px",
					height: d.chartHeight + "px"
				}, c);
				d.setChartSize(!0);
				f.setSize(d.chartWidth, d.chartHeight, h);
				m(d.axes, function(a) {
					a.isDirty = !0;
					a.setScale()
				});
				d.isDirtyLegend = !0;
				d.isDirtyBox = !0;
				d.layOutTitles();
				d.getMargins();
				d.redraw(h);
				d.oldChartHeight = null;
				b(d, "resize");
				Q(function() {
					d && b(d, "endResize", null, function() {
						--d.isResizing
					})
				}, x(c).duration)
			},
			setChartSize: function(a) {
				var b = this.inverted,
					c = this.renderer,
					e = this.chartWidth,
					h = this.chartHeight,
					g = this.options.chart,
					d = this.spacing,
					f = this.clipOffset,
					k, p, w, l;
				this.plotLeft = k = Math.round(this.plotLeft);
				this.plotTop = p = Math.round(this.plotTop);
				this.plotWidth = w = Math.max(0, Math.round(e - k - this.marginRight));
				this.plotHeight = l = Math.max(0, Math.round(h - p - this.marginBottom));
				this.plotSizeX = b ? l : w;
				this.plotSizeY = b ? w : l;
				this.plotBorderWidth = g.plotBorderWidth || 0;
				this.spacingBox = c.spacingBox = {
					x: d[3],
					y: d[0],
					width: e - d[3] - d[1],
					height: h - d[0] - d[2]
				};
				this.plotBox = c.plotBox = {
					x: k,
					y: p,
					width: w,
					height: l
				};
				e = 2 * Math.floor(this.plotBorderWidth / 2);
				b = Math.ceil(Math.max(e, f[3]) / 2);
				c = Math.ceil(Math.max(e, f[0]) / 2);
				this.clipBox = {
					x: b,
					y: c,
					width: Math.floor(this.plotSizeX - Math.max(e, f[1]) / 2 - b),
					height: Math.max(0, Math.floor(this.plotSizeY -
						Math.max(e, f[2]) / 2 - c))
				};
				a || m(this.axes, function(a) {
					a.setAxisSize();
					a.setAxisTranslation()
				})
			},
			resetMargins: function() {
				var a = this,
					b = a.options.chart;
				m(["margin", "spacing"], function(c) {
					var e = b[c],
						h = D(e) ? e : [e, e, e, e];
					m(["Top", "Right", "Bottom", "Left"], function(e, g) {
						a[c][g] = w(b[c + e], h[g])
					})
				});
				m(J, function(b, c) {
					a[b] = w(a.margin[c], a.spacing[c])
				});
				a.axisOffset = [0, 0, 0, 0];
				a.clipOffset = [0, 0, 0, 0]
			},
			drawChartBox: function() {
				var a = this.options.chart,
					b = this.renderer,
					c = this.chartWidth,
					e = this.chartHeight,
					h = this.chartBackground,
					g = this.plotBackground,
					d = this.plotBorder,
					f, k = this.plotBGImage,
					p = a.backgroundColor,
					w = a.plotBackgroundColor,
					l = a.plotBackgroundImage,
					u, m = this.plotLeft,
					G = this.plotTop,
					E = this.plotWidth,
					n = this.plotHeight,
					r = this.plotBox,
					H = this.clipRect,
					F = this.clipBox,
					z = "animate";
				h || (this.chartBackground = h = b.rect().addClass("highcharts-background").add(), z = "attr");
				f = a.borderWidth || 0;
				u = f + (a.shadow ? 8 : 0);
				p = {
					fill: p || "none"
				};
				if(f || h["stroke-width"]) p.stroke = a.borderColor, p["stroke-width"] = f;
				h.attr(p).shadow(a.shadow);
				h[z]({
					x: u /
						2,
					y: u / 2,
					width: c - u - f % 2,
					height: e - u - f % 2,
					r: a.borderRadius
				});
				z = "animate";
				g || (z = "attr", this.plotBackground = g = b.rect().addClass("highcharts-plot-background").add());
				g[z](r);
				g.attr({
					fill: w || "none"
				}).shadow(a.plotShadow);
				l && (k ? k.animate(r) : this.plotBGImage = b.image(l, m, G, E, n).add());
				H ? H.animate({
					width: F.width,
					height: F.height
				}) : this.clipRect = b.clipRect(F);
				z = "animate";
				d || (z = "attr", this.plotBorder = d = b.rect().addClass("highcharts-plot-border").attr({
					zIndex: 1
				}).add());
				d.attr({
					stroke: a.plotBorderColor,
					"stroke-width": a.plotBorderWidth ||
						0,
					fill: "none"
				});
				d[z](d.crisp({
					x: m,
					y: G,
					width: E,
					height: n
				}, -d.strokeWidth()));
				this.isDirtyBox = !1
			},
			propFromSeries: function() {
				var a = this,
					b = a.options.chart,
					c, e = a.options.series,
					h, g;
				m(["inverted", "angular", "polar"], function(d) {
					c = H[b.type || b.defaultSeriesType];
					g = b[d] || c && c.prototype[d];
					for(h = e && e.length; !g && h--;)(c = H[e[h].type]) && c.prototype[d] && (g = !0);
					a[d] = g
				})
			},
			linkSeries: function() {
				var a = this,
					b = a.series;
				m(b, function(a) {
					a.linkedSeries.length = 0
				});
				m(b, function(b) {
					var c = b.options.linkedTo;
					I(c) && (c = ":previous" ===
						c ? a.series[b.index - 1] : a.get(c)) && c.linkedParent !== b && (c.linkedSeries.push(b), b.linkedParent = c, b.visible = w(b.options.visible, c.options.visible, b.visible))
				})
			},
			renderSeries: function() {
				m(this.series, function(a) {
					a.translate();
					a.render()
				})
			},
			renderLabels: function() {
				var a = this,
					b = a.options.labels;
				b.items && m(b.items, function(c) {
					var e = k(b.style, c.style),
						h = G(e.left) + a.plotLeft,
						g = G(e.top) + a.plotTop + 12;
					delete e.left;
					delete e.top;
					a.renderer.text(c.html, h, g).attr({
						zIndex: 2
					}).css(e).add()
				})
			},
			render: function() {
				var a =
					this.axes,
					b = this.renderer,
					c = this.options,
					e, h, g;
				this.setTitle();
				this.legend = new B(this, c.legend);
				this.getStacks && this.getStacks();
				this.getMargins(!0);
				this.setChartSize();
				c = this.plotWidth;
				e = this.plotHeight = Math.max(this.plotHeight - 21, 0);
				m(a, function(a) {
					a.setScale()
				});
				this.getAxisMargins();
				h = 1.1 < c / this.plotWidth;
				g = 1.05 < e / this.plotHeight;
				if(h || g) m(a, function(a) {
					(a.horiz && h || !a.horiz && g) && a.setTickInterval(!0)
				}), this.getMargins();
				this.drawChartBox();
				this.hasCartesianSeries && m(a, function(a) {
					a.visible &&
						a.render()
				});
				this.seriesGroup || (this.seriesGroup = b.g("series-group").attr({
					zIndex: 3
				}).add());
				this.renderSeries();
				this.renderLabels();
				this.addCredits();
				this.setResponsive && this.setResponsive();
				this.hasRendered = !0
			},
			addCredits: function(a) {
				var b = this;
				a = F(!0, this.options.credits, a);
				a.enabled && !this.credits && (this.credits = this.renderer.text(a.text + (this.mapCredits || ""), 0, 0).addClass("highcharts-credits").on("click", function() {
						a.href && (M.location.href = a.href)
					}).attr({
						align: a.position.align,
						zIndex: 8
					}).css(a.style).add().align(a.position),
					this.credits.update = function(a) {
						b.credits = b.credits.destroy();
						b.addCredits(a)
					})
			},
			destroy: function() {
				var c = this,
					e = c.axes,
					h = c.series,
					g = c.container,
					d, f = g && g.parentNode;
				b(c, "destroy");
				c.renderer.forExport ? a.erase(l, c) : l[c.index] = void 0;
				a.chartCount--;
				c.renderTo.removeAttribute("data-highcharts-chart");
				E(c);
				for(d = e.length; d--;) e[d] = e[d].destroy();
				this.scroller && this.scroller.destroy && this.scroller.destroy();
				for(d = h.length; d--;) h[d] = h[d].destroy();
				m("title subtitle chartBackground plotBackground plotBGImage plotBorder seriesGroup clipRect credits pointer rangeSelector legend resetZoomButton tooltip renderer".split(" "),
					function(a) {
						var b = c[a];
						b && b.destroy && (c[a] = b.destroy())
					});
				g && (g.innerHTML = "", E(g), f && n(g));
				z(c, function(a, b) {
					delete c[b]
				})
			},
			isReadyToRender: function() {
				var a = this;
				return u || M != M.top || "complete" === d.readyState ? !0 : (d.attachEvent("onreadystatechange", function() {
					d.detachEvent("onreadystatechange", a.firstRender);
					"complete" === d.readyState && a.firstRender()
				}), !1)
			},
			firstRender: function() {
				var a = this,
					c = a.options;
				if(a.isReadyToRender()) {
					a.getContainer();
					b(a, "init");
					a.resetMargins();
					a.setChartSize();
					a.propFromSeries();
					a.getAxes();
					m(c.series || [], function(b) {
						a.initSeries(b)
					});
					a.linkSeries();
					b(a, "beforeRender");
					N && (a.pointer = new N(a, c));
					a.render();
					if(!a.renderer.imgCount && a.onload) a.onload();
					a.temporaryDisplay(!0)
				}
			},
			onload: function() {
				m([this.callback].concat(this.callbacks), function(a) {
					a && void 0 !== this.index && a.apply(this, [this])
				}, this);
				b(this, "load");
				b(this, "render");
				r(this.index) && !1 !== this.options.chart.reflow && this.initReflow();
				this.onload = null
			}
		})
	})(K);
	(function(a) {
		var y, C = a.each,
			x = a.extend,
			f = a.erase,
			d = a.fireEvent,
			v = a.format,
			t = a.isArray,
			q = a.isNumber,
			n = a.pick,
			l = a.removeEvent;
		a.Point = y = function() {};
		a.Point.prototype = {
			init: function(a, d, f) {
				this.series = a;
				this.color = a.color;
				this.applyOptions(d, f);
				a.options.colorByPoint ? (d = a.options.colors || a.chart.options.colors, this.color = this.color || d[a.colorCounter], d = d.length, f = a.colorCounter, a.colorCounter++, a.colorCounter === d && (a.colorCounter = 0)) : f = a.colorIndex;
				this.colorIndex = n(this.colorIndex, f);
				a.chart.pointCount++;
				return this
			},
			applyOptions: function(a, d) {
				var g = this.series,
					f = g.options.pointValKey || g.pointValKey;
				a = y.prototype.optionsToObject.call(this, a);
				x(this, a);
				this.options = this.options ? x(this.options, a) : a;
				a.group && delete this.group;
				f && (this.y = this[f]);
				this.isNull = n(this.isValid && !this.isValid(), null === this.x || !q(this.y, !0));
				this.selected && (this.state = "select");
				"name" in this && void 0 === d && g.xAxis && g.xAxis.hasNames && (this.x = g.xAxis.nameToX(this));
				void 0 === this.x && g && (this.x = void 0 === d ? g.autoIncrement(this) : d);
				return this
			},
			optionsToObject: function(a) {
				var g = {},
					d = this.series,
					f = d.options.keys,
					e = f || d.pointArrayMap || ["y"],
					b = e.length,
					c = 0,
					h = 0;
				if(q(a) || null === a) g[e[0]] = a;
				else if(t(a))
					for(!f && a.length > b && (d = typeof a[0], "string" === d ? g.name = a[0] : "number" === d && (g.x = a[0]), c++); h < b;) f && void 0 === a[c] || (g[e[h]] = a[c]), c++, h++;
				else "object" === typeof a && (g = a, a.dataLabels && (d._hasPointLabels = !0), a.marker && (d._hasPointMarkers = !0));
				return g
			},
			getClassName: function() {
				return "highcharts-point" + (this.selected ? " highcharts-point-select" : "") + (this.negative ? " highcharts-negative" : "") + (this.isNull ?
					" highcharts-null-point" : "") + (void 0 !== this.colorIndex ? " highcharts-color-" + this.colorIndex : "") + (this.options.className ? " " + this.options.className : "") + (this.zone && this.zone.className ? " " + this.zone.className.replace("highcharts-negative", "") : "")
			},
			getZone: function() {
				var a = this.series,
					d = a.zones,
					a = a.zoneAxis || "y",
					f = 0,
					k;
				for(k = d[f]; this[a] >= k.value;) k = d[++f];
				k && k.color && !this.options.color && (this.color = k.color);
				return k
			},
			destroy: function() {
				var a = this.series.chart,
					d = a.hoverPoints,
					m;
				a.pointCount--;
				d && (this.setState(),
					f(d, this), d.length || (a.hoverPoints = null));
				if(this === a.hoverPoint) this.onMouseOut();
				if(this.graphic || this.dataLabel) l(this), this.destroyElements();
				this.legendItem && a.legend.destroyItem(this);
				for(m in this) this[m] = null
			},
			destroyElements: function() {
				for(var a = ["graphic", "dataLabel", "dataLabelUpper", "connector", "shadowGroup"], d, f = 6; f--;) d = a[f], this[d] && (this[d] = this[d].destroy())
			},
			getLabelConfig: function() {
				return {
					x: this.category,
					y: this.y,
					color: this.color,
					colorIndex: this.colorIndex,
					key: this.name || this.category,
					series: this.series,
					point: this,
					percentage: this.percentage,
					total: this.total || this.stackTotal
				}
			},
			tooltipFormatter: function(a) {
				var d = this.series,
					g = d.tooltipOptions,
					f = n(g.valueDecimals, ""),
					e = g.valuePrefix || "",
					b = g.valueSuffix || "";
				C(d.pointArrayMap || ["y"], function(c) {
					c = "{point." + c;
					if(e || b) a = a.replace(c + "}", e + c + "}" + b);
					a = a.replace(c + "}", c + ":,." + f + "f}")
				});
				return v(a, {
					point: this,
					series: this.series
				})
			},
			firePointEvent: function(a, f, l) {
				var g = this,
					e = this.series.options;
				(e.point.events[a] || g.options && g.options.events &&
					g.options.events[a]) && this.importEvents();
				"click" === a && e.allowPointSelect && (l = function(a) {
					g.select && g.select(null, a.ctrlKey || a.metaKey || a.shiftKey)
				});
				d(this, a, f, l)
			},
			visible: !0
		}
	})(K);
	(function(a) {
		var y = a.addEvent,
			C = a.animObject,
			x = a.arrayMax,
			f = a.arrayMin,
			d = a.correctFloat,
			v = a.Date,
			t = a.defaultOptions,
			q = a.defaultPlotOptions,
			n = a.defined,
			l = a.each,
			g = a.erase,
			r = a.extend,
			m = a.fireEvent,
			k = a.grep,
			e = a.isArray,
			b = a.isNumber,
			c = a.isString,
			h = a.merge,
			D = a.objectEach,
			I = a.pick,
			B = a.removeEvent,
			J = a.splat,
			F = a.SVGElement,
			z =
			a.syncTimeout,
			N = a.win;
		a.Series = a.seriesType("line", null, {
			lineWidth: 2,
			allowPointSelect: !1,
			showCheckbox: !1,
			animation: {
				duration: 1E3
			},
			events: {},
			marker: {
				lineWidth: 0,
				lineColor: "#ffffff",
				radius: 4,
				states: {
					hover: {
						animation: {
							duration: 50
						},
						enabled: !0,
						radiusPlus: 2,
						lineWidthPlus: 1
					},
					select: {
						fillColor: "#cccccc",
						lineColor: "#000000",
						lineWidth: 2
					}
				}
			},
			point: {
				events: {}
			},
			dataLabels: {
				align: "center",
				formatter: function() {
					return null === this.y ? "" : a.numberFormat(this.y, -1)
				},
				style: {
					fontSize: "11px",
					fontWeight: "bold",
					color: "contrast",
					textOutline: "1px contrast"
				},
				verticalAlign: "bottom",
				x: 0,
				y: 0,
				padding: 5
			},
			cropThreshold: 300,
			pointRange: 0,
			softThreshold: !0,
			states: {
				hover: {
					animation: {
						duration: 50
					},
					lineWidthPlus: 1,
					marker: {},
					halo: {
						size: 10,
						opacity: .25
					}
				},
				select: {
					marker: {}
				}
			},
			stickyTracking: !0,
			turboThreshold: 1E3,
			findNearestPointBy: "x"
		}, {
			isCartesian: !0,
			pointClass: a.Point,
			sorted: !0,
			requireSorting: !0,
			directTouch: !1,
			axisTypes: ["xAxis", "yAxis"],
			colorCounter: 0,
			parallelArrays: ["x", "y"],
			coll: "series",
			init: function(a, b) {
				var c = this,
					e, h = a.series,
					d;
				c.chart =
					a;
				c.options = b = c.setOptions(b);
				c.linkedSeries = [];
				c.bindAxes();
				r(c, {
					name: b.name,
					state: "",
					visible: !1 !== b.visible,
					selected: !0 === b.selected
				});
				e = b.events;
				D(e, function(a, b) {
					y(c, b, a)
				});
				if(e && e.click || b.point && b.point.events && b.point.events.click || b.allowPointSelect) a.runTrackerClick = !0;
				c.getColor();
				c.getSymbol();
				l(c.parallelArrays, function(a) {
					c[a + "Data"] = []
				});
				c.setData(b.data, !1);
				c.isCartesian && (a.hasCartesianSeries = !0);
				h.length && (d = h[h.length - 1]);
				c._i = I(d && d._i, -1) + 1;
				a.orderSeries(this.insert(h))
			},
			insert: function(a) {
				var c =
					this.options.index,
					e;
				if(b(c)) {
					for(e = a.length; e--;)
						if(c >= I(a[e].options.index, a[e]._i)) {
							a.splice(e + 1, 0, this);
							break
						} - 1 === e && a.unshift(this);
					e += 1
				} else a.push(this);
				return I(e, a.length - 1)
			},
			bindAxes: function() {
				var b = this,
					c = b.options,
					e = b.chart,
					h;
				l(b.axisTypes || [], function(d) {
					l(e[d], function(a) {
						h = a.options;
						if(c[d] === h.index || void 0 !== c[d] && c[d] === h.id || void 0 === c[d] && 0 === h.index) b.insert(a.series), b[d] = a, a.isDirty = !0
					});
					b[d] || b.optionalAxis === d || a.error(18, !0)
				})
			},
			updateParallelArrays: function(a, c) {
				var e =
					a.series,
					h = arguments,
					d = b(c) ? function(b) {
						var h = "y" === b && e.toYData ? e.toYData(a) : a[b];
						e[b + "Data"][c] = h
					} : function(a) {
						Array.prototype[c].apply(e[a + "Data"], Array.prototype.slice.call(h, 2))
					};
				l(e.parallelArrays, d)
			},
			autoIncrement: function() {
				var a = this.options,
					b = this.xIncrement,
					c, e = a.pointIntervalUnit,
					b = I(b, a.pointStart, 0);
				this.pointInterval = c = I(this.pointInterval, a.pointInterval, 1);
				e && (a = new v(b), "day" === e ? a = +a[v.hcSetDate](a[v.hcGetDate]() + c) : "month" === e ? a = +a[v.hcSetMonth](a[v.hcGetMonth]() + c) : "year" === e &&
					(a = +a[v.hcSetFullYear](a[v.hcGetFullYear]() + c)), c = a - b);
				this.xIncrement = b + c;
				return b
			},
			setOptions: function(a) {
				var b = this.chart,
					c = b.options,
					e = c.plotOptions,
					d = (b.userOptions || {}).plotOptions || {},
					g = e[this.type];
				this.userOptions = a;
				b = h(g, e.series, a);
				this.tooltipOptions = h(t.tooltip, t.plotOptions.series && t.plotOptions.series.tooltip, t.plotOptions[this.type].tooltip, c.tooltip.userOptions, e.series && e.series.tooltip, e[this.type].tooltip, a.tooltip);
				this.stickyTracking = I(a.stickyTracking, d[this.type] && d[this.type].stickyTracking,
					d.series && d.series.stickyTracking, this.tooltipOptions.shared && !this.noSharedTooltip ? !0 : b.stickyTracking);
				null === g.marker && delete b.marker;
				this.zoneAxis = b.zoneAxis;
				a = this.zones = (b.zones || []).slice();
				!b.negativeColor && !b.negativeFillColor || b.zones || a.push({
					value: b[this.zoneAxis + "Threshold"] || b.threshold || 0,
					className: "highcharts-negative",
					color: b.negativeColor,
					fillColor: b.negativeFillColor
				});
				a.length && n(a[a.length - 1].value) && a.push({
					color: this.color,
					fillColor: this.fillColor
				});
				return b
			},
			getCyclic: function(a,
				b, c) {
				var e, h = this.chart,
					d = this.userOptions,
					g = a + "Index",
					f = a + "Counter",
					k = c ? c.length : I(h.options.chart[a + "Count"], h[a + "Count"]);
				b || (e = I(d[g], d["_" + g]), n(e) || (h.series.length || (h[f] = 0), d["_" + g] = e = h[f] % k, h[f] += 1), c && (b = c[e]));
				void 0 !== e && (this[g] = e);
				this[a] = b
			},
			getColor: function() {
				this.options.colorByPoint ? this.options.color = null : this.getCyclic("color", this.options.color || q[this.type].color, this.chart.options.colors)
			},
			getSymbol: function() {
				this.getCyclic("symbol", this.options.marker.symbol, this.chart.options.symbols)
			},
			drawLegendSymbol: a.LegendSymbolMixin.drawLineMarker,
			setData: function(h, d, g, f) {
				var k = this,
					w = k.points,
					m = w && w.length || 0,
					n, G = k.options,
					r = k.chart,
					E = null,
					z = k.xAxis,
					F = G.turboThreshold,
					B = this.xData,
					q = this.yData,
					H = (n = k.pointArrayMap) && n.length;
				h = h || [];
				n = h.length;
				d = I(d, !0);
				if(!1 !== f && n && m === n && !k.cropped && !k.hasGroupedData && k.visible) l(h, function(a, b) {
					w[b].update && a !== G.data[b] && w[b].update(a, !1, null, !1)
				});
				else {
					k.xIncrement = null;
					k.colorCounter = 0;
					l(this.parallelArrays, function(a) {
						k[a + "Data"].length = 0
					});
					if(F &&
						n > F) {
						for(g = 0; null === E && g < n;) E = h[g], g++;
						if(b(E))
							for(g = 0; g < n; g++) B[g] = this.autoIncrement(), q[g] = h[g];
						else if(e(E))
							if(H)
								for(g = 0; g < n; g++) E = h[g], B[g] = E[0], q[g] = E.slice(1, H + 1);
							else
								for(g = 0; g < n; g++) E = h[g], B[g] = E[0], q[g] = E[1];
						else a.error(12)
					} else
						for(g = 0; g < n; g++) void 0 !== h[g] && (E = {
							series: k
						}, k.pointClass.prototype.applyOptions.apply(E, [h[g]]), k.updateParallelArrays(E, g));
					q && c(q[0]) && a.error(14, !0);
					k.data = [];
					k.options.data = k.userOptions.data = h;
					for(g = m; g--;) w[g] && w[g].destroy && w[g].destroy();
					z && (z.minRange =
						z.userMinRange);
					k.isDirty = r.isDirtyBox = !0;
					k.isDirtyData = !!w;
					g = !1
				}
				"point" === G.legendType && (this.processData(), this.generatePoints());
				d && r.redraw(g)
			},
			processData: function(b) {
				var c = this.xData,
					e = this.yData,
					h = c.length,
					d;
				d = 0;
				var g, f, k = this.xAxis,
					w, l = this.options;
				w = l.cropThreshold;
				var n = this.getExtremesFromAll || l.getExtremesFromAll,
					m = this.isCartesian,
					l = k && k.val2lin,
					r = k && k.isLog,
					z = this.requireSorting,
					F, B;
				if(m && !this.isDirty && !k.isDirty && !this.yAxis.isDirty && !b) return !1;
				k && (b = k.getExtremes(), F = b.min, B = b.max);
				if(m && this.sorted && !n && (!w || h > w || this.forceCrop))
					if(c[h - 1] < F || c[0] > B) c = [], e = [];
					else if(c[0] < F || c[h - 1] > B) d = this.cropData(this.xData, this.yData, F, B), c = d.xData, e = d.yData, d = d.start, g = !0;
				for(w = c.length || 1; --w;) h = r ? l(c[w]) - l(c[w - 1]) : c[w] - c[w - 1], 0 < h && (void 0 === f || h < f) ? f = h : 0 > h && z && (a.error(15), z = !1);
				this.cropped = g;
				this.cropStart = d;
				this.processedXData = c;
				this.processedYData = e;
				this.closestPointRange = f
			},
			cropData: function(a, b, c, e) {
				var h = a.length,
					d = 0,
					g = h,
					f = I(this.cropShoulder, 1),
					k;
				for(k = 0; k < h; k++)
					if(a[k] >= c) {
						d =
							Math.max(0, k - f);
						break
					}
				for(c = k; c < h; c++)
					if(a[c] > e) {
						g = c + f;
						break
					}
				return {
					xData: a.slice(d, g),
					yData: b.slice(d, g),
					start: d,
					end: g
				}
			},
			generatePoints: function() {
				var a = this.options,
					b = a.data,
					c = this.data,
					e, h = this.processedXData,
					d = this.processedYData,
					g = this.pointClass,
					f = h.length,
					k = this.cropStart || 0,
					l, n = this.hasGroupedData,
					a = a.keys,
					m, r = [],
					z;
				c || n || (c = [], c.length = b.length, c = this.data = c);
				a && n && (this.options.keys = !1);
				for(z = 0; z < f; z++) l = k + z, n ? (m = (new g).init(this, [h[z]].concat(J(d[z]))), m.dataGroup = this.groupMap[z]) : (m =
					c[l]) || void 0 === b[l] || (c[l] = m = (new g).init(this, b[l], h[z])), m && (m.index = l, r[z] = m);
				this.options.keys = a;
				if(c && (f !== (e = c.length) || n))
					for(z = 0; z < e; z++) z !== k || n || (z += f), c[z] && (c[z].destroyElements(), c[z].plotX = void 0);
				this.data = c;
				this.points = r
			},
			getExtremes: function(a) {
				var c = this.yAxis,
					h = this.processedXData,
					d, g = [],
					k = 0;
				d = this.xAxis.getExtremes();
				var w = d.min,
					l = d.max,
					m, n, z, r;
				a = a || this.stackedYData || this.processedYData || [];
				d = a.length;
				for(r = 0; r < d; r++)
					if(n = h[r], z = a[r], m = (b(z, !0) || e(z)) && (!c.positiveValuesOnly ||
							z.length || 0 < z), n = this.getExtremesFromAll || this.options.getExtremesFromAll || this.cropped || (h[r + 1] || n) >= w && (h[r - 1] || n) <= l, m && n)
						if(m = z.length)
							for(; m--;) null !== z[m] && (g[k++] = z[m]);
						else g[k++] = z;
				this.dataMin = f(g);
				this.dataMax = x(g)
			},
			translate: function() {
				this.processedXData || this.processData();
				this.generatePoints();
				var a = this.options,
					c = a.stacking,
					e = this.xAxis,
					h = e.categories,
					g = this.yAxis,
					f = this.points,
					k = f.length,
					l = !!this.modifyValue,
					m = a.pointPlacement,
					z = "between" === m || b(m),
					r = a.threshold,
					F = a.startFromThreshold ?
					r : 0,
					B, q, v, t, D = Number.MAX_VALUE;
				"between" === m && (m = .5);
				b(m) && (m *= I(a.pointRange || e.pointRange));
				for(a = 0; a < k; a++) {
					var J = f[a],
						N = J.x,
						x = J.y;
					q = J.low;
					var y = c && g.stacks[(this.negStacks && x < (F ? 0 : r) ? "-" : "") + this.stackKey],
						C;
					g.positiveValuesOnly && null !== x && 0 >= x && (J.isNull = !0);
					J.plotX = B = d(Math.min(Math.max(-1E5, e.translate(N, 0, 0, 0, 1, m, "flags" === this.type)), 1E5));
					c && this.visible && !J.isNull && y && y[N] && (t = this.getStackIndicator(t, N, this.index), C = y[N], x = C.points[t.key], q = x[0], x = x[1], q === F && t.key === y[N].base && (q = I(r,
						g.min)), g.positiveValuesOnly && 0 >= q && (q = null), J.total = J.stackTotal = C.total, J.percentage = C.total && J.y / C.total * 100, J.stackY = x, C.setOffset(this.pointXOffset || 0, this.barW || 0));
					J.yBottom = n(q) ? g.translate(q, 0, 1, 0, 1) : null;
					l && (x = this.modifyValue(x, J));
					J.plotY = q = "number" === typeof x && Infinity !== x ? Math.min(Math.max(-1E5, g.translate(x, 0, 1, 0, 1)), 1E5) : void 0;
					J.isInside = void 0 !== q && 0 <= q && q <= g.len && 0 <= B && B <= e.len;
					J.clientX = z ? d(e.translate(N, 0, 0, 0, 1, m)) : B;
					J.negative = J.y < (r || 0);
					J.category = h && void 0 !== h[J.x] ? h[J.x] :
						J.x;
					J.isNull || (void 0 !== v && (D = Math.min(D, Math.abs(B - v))), v = B);
					J.zone = this.zones.length && J.getZone()
				}
				this.closestPointRangePx = D
			},
			getValidPoints: function(a, b) {
				var c = this.chart;
				return k(a || this.points || [], function(a) {
					return b && !c.isInsidePlot(a.plotX, a.plotY, c.inverted) ? !1 : !a.isNull
				})
			},
			setClip: function(a) {
				var b = this.chart,
					c = this.options,
					e = b.renderer,
					h = b.inverted,
					d = this.clipBox,
					g = d || b.clipBox,
					f = this.sharedClipKey || ["_sharedClip", a && a.duration, a && a.easing, g.height, c.xAxis, c.yAxis].join(),
					k = b[f],
					l = b[f +
						"m"];
				k || (a && (g.width = 0, h && (g.x = b.plotSizeX), b[f + "m"] = l = e.clipRect(h ? b.plotSizeX + 99 : -99, h ? -b.plotLeft : -b.plotTop, 99, h ? b.chartWidth : b.chartHeight)), b[f] = k = e.clipRect(g), k.count = {
					length: 0
				});
				a && !k.count[this.index] && (k.count[this.index] = !0, k.count.length += 1);
				!1 !== c.clip && (this.group.clip(a || d ? k : b.clipRect), this.markerGroup.clip(l), this.sharedClipKey = f);
				a || (k.count[this.index] && (delete k.count[this.index], --k.count.length), 0 === k.count.length && f && b[f] && (d || (b[f] = b[f].destroy()), b[f + "m"] && (b[f + "m"] = b[f +
					"m"].destroy())))
			},
			animate: function(a) {
				var b = this.chart,
					c = C(this.options.animation),
					e;
				a ? this.setClip(c) : (e = this.sharedClipKey, (a = b[e]) && a.animate({
					width: b.plotSizeX,
					x: 0
				}, c), b[e + "m"] && b[e + "m"].animate({
					width: b.plotSizeX + 99,
					x: 0
				}, c), this.animate = null)
			},
			afterAnimate: function() {
				this.setClip();
				m(this, "afterAnimate");
				this.finishedAnimating = !0
			},
			drawPoints: function() {
				var a = this.points,
					b = this.chart,
					c, e, h, d, g = this.options.marker,
					f, k, l, m = this[this.specialGroup] || this.markerGroup,
					n, r = I(g.enabled, this.xAxis.isRadial ?
						!0 : null, this.closestPointRangePx >= 2 * g.radius);
				if(!1 !== g.enabled || this._hasPointMarkers)
					for(c = 0; c < a.length; c++) e = a[c], d = e.graphic, f = e.marker || {}, k = !!e.marker, h = r && void 0 === f.enabled || f.enabled, l = e.isInside, h && !e.isNull ? (h = I(f.symbol, this.symbol), e.hasImage = 0 === h.indexOf("url"), n = this.markerAttribs(e, e.selected && "select"), d ? d[l ? "show" : "hide"](!0).animate(n) : l && (0 < n.width || e.hasImage) && (e.graphic = d = b.renderer.symbol(h, n.x, n.y, n.width, n.height, k ? f : g).add(m)), d && d.attr(this.pointAttribs(e, e.selected &&
						"select")), d && d.addClass(e.getClassName(), !0)) : d && (e.graphic = d.destroy())
			},
			markerAttribs: function(a, b) {
				var c = this.options.marker,
					e = a.marker || {},
					h = I(e.radius, c.radius);
				b && (c = c.states[b], b = e.states && e.states[b], h = I(b && b.radius, c && c.radius, h + (c && c.radiusPlus || 0)));
				a.hasImage && (h = 0);
				a = {
					x: Math.floor(a.plotX) - h,
					y: a.plotY - h
				};
				h && (a.width = a.height = 2 * h);
				return a
			},
			pointAttribs: function(a, b) {
				var c = this.options.marker,
					e = a && a.options,
					h = e && e.marker || {},
					d = this.color,
					g = e && e.color,
					f = a && a.color,
					e = I(h.lineWidth, c.lineWidth);
				a = a && a.zone && a.zone.color;
				d = g || a || f || d;
				a = h.fillColor || c.fillColor || d;
				d = h.lineColor || c.lineColor || d;
				b && (c = c.states[b], b = h.states && h.states[b] || {}, e = I(b.lineWidth, c.lineWidth, e + I(b.lineWidthPlus, c.lineWidthPlus, 0)), a = b.fillColor || c.fillColor || a, d = b.lineColor || c.lineColor || d);
				return {
					stroke: d,
					"stroke-width": e,
					fill: a
				}
			},
			destroy: function() {
				var a = this,
					b = a.chart,
					c = /AppleWebKit\/533/.test(N.navigator.userAgent),
					e, h, d = a.data || [],
					f, k;
				m(a, "destroy");
				B(a);
				l(a.axisTypes || [], function(b) {
					(k = a[b]) && k.series && (g(k.series,
						a), k.isDirty = k.forceRedraw = !0)
				});
				a.legendItem && a.chart.legend.destroyItem(a);
				for(h = d.length; h--;)(f = d[h]) && f.destroy && f.destroy();
				a.points = null;
				clearTimeout(a.animationTimeout);
				D(a, function(a, b) {
					a instanceof F && !a.survive && (e = c && "group" === b ? "hide" : "destroy", a[e]())
				});
				b.hoverSeries === a && (b.hoverSeries = null);
				g(b.series, a);
				b.orderSeries();
				D(a, function(b, c) {
					delete a[c]
				})
			},
			getGraphPath: function(a, b, c) {
				var e = this,
					h = e.options,
					d = h.step,
					g, f = [],
					k = [],
					w;
				a = a || e.points;
				(g = a.reversed) && a.reverse();
				(d = {
						right: 1,
						center: 2
					}[d] ||
					d && 3) && g && (d = 4 - d);
				!h.connectNulls || b || c || (a = this.getValidPoints(a));
				l(a, function(g, l) {
					var p = g.plotX,
						m = g.plotY,
						u = a[l - 1];
					(g.leftCliff || u && u.rightCliff) && !c && (w = !0);
					g.isNull && !n(b) && 0 < l ? w = !h.connectNulls : g.isNull && !b ? w = !0 : (0 === l || w ? l = ["M", g.plotX, g.plotY] : e.getPointSpline ? l = e.getPointSpline(a, g, l) : d ? (l = 1 === d ? ["L", u.plotX, m] : 2 === d ? ["L", (u.plotX + p) / 2, u.plotY, "L", (u.plotX + p) / 2, m] : ["L", p, u.plotY], l.push("L", p, m)) : l = ["L", p, m], k.push(g.x), d && k.push(g.x), f.push.apply(f, l), w = !1)
				});
				f.xMap = k;
				return e.graphPath =
					f
			},
			drawGraph: function() {
				var a = this,
					b = this.options,
					c = (this.gappedPath || this.getGraphPath).call(this),
					e = [
						["graph", "highcharts-graph", b.lineColor || this.color, b.dashStyle]
					];
				l(this.zones, function(c, h) {
					e.push(["zone-graph-" + h, "highcharts-graph highcharts-zone-graph-" + h + " " + (c.className || ""), c.color || a.color, c.dashStyle || b.dashStyle])
				});
				l(e, function(e, h) {
					var d = e[0],
						g = a[d];
					g ? (g.endX = a.preventGraphAnimation ? null : c.xMap, g.animate({
						d: c
					})) : c.length && (a[d] = a.chart.renderer.path(c).addClass(e[1]).attr({
							zIndex: 1
						}).add(a.group),
						g = {
							stroke: e[2],
							"stroke-width": b.lineWidth,
							fill: a.fillGraph && a.color || "none"
						}, e[3] ? g.dashstyle = e[3] : "square" !== b.linecap && (g["stroke-linecap"] = g["stroke-linejoin"] = "round"), g = a[d].attr(g).shadow(2 > h && b.shadow));
					g && (g.startX = c.xMap, g.isArea = c.isArea)
				})
			},
			applyZones: function() {
				var a = this,
					b = this.chart,
					c = b.renderer,
					e = this.zones,
					h, d, g = this.clips || [],
					f, k = this.graph,
					m = this.area,
					n = Math.max(b.chartWidth, b.chartHeight),
					r = this[(this.zoneAxis || "y") + "Axis"],
					z, F, B = b.inverted,
					q, v, t, J, D = !1;
				e.length && (k || m) && r && void 0 !==
					r.min && (F = r.reversed, q = r.horiz, k && k.hide(), m && m.hide(), z = r.getExtremes(), l(e, function(e, l) {
						h = F ? q ? b.plotWidth : 0 : q ? 0 : r.toPixels(z.min);
						h = Math.min(Math.max(I(d, h), 0), n);
						d = Math.min(Math.max(Math.round(r.toPixels(I(e.value, z.max), !0)), 0), n);
						D && (h = d = r.toPixels(z.max));
						v = Math.abs(h - d);
						t = Math.min(h, d);
						J = Math.max(h, d);
						r.isXAxis ? (f = {
							x: B ? J : t,
							y: 0,
							width: v,
							height: n
						}, q || (f.x = b.plotHeight - f.x)) : (f = {
							x: 0,
							y: B ? J : t,
							width: n,
							height: v
						}, q && (f.y = b.plotWidth - f.y));
						B && c.isVML && (f = r.isXAxis ? {
							x: 0,
							y: F ? t : J,
							height: f.width,
							width: b.chartWidth
						} : {
							x: f.y - b.plotLeft - b.spacingBox.x,
							y: 0,
							width: f.height,
							height: b.chartHeight
						});
						g[l] ? g[l].animate(f) : (g[l] = c.clipRect(f), k && a["zone-graph-" + l].clip(g[l]), m && a["zone-area-" + l].clip(g[l]));
						D = e.value > z.max
					}), this.clips = g)
			},
			invertGroups: function(a) {
				function b() {
					l(["group", "markerGroup"], function(b) {
						c[b] && (e.renderer.isVML && c[b].attr({
							width: c.yAxis.len,
							height: c.xAxis.len
						}), c[b].width = c.yAxis.len, c[b].height = c.xAxis.len, c[b].invert(a))
					})
				}
				var c = this,
					e = c.chart,
					h;
				c.xAxis && (h = y(e, "resize", b), y(c, "destroy", h), b(a),
					c.invertGroups = b)
			},
			plotGroup: function(a, b, c, e, h) {
				var d = this[a],
					g = !d;
				g && (this[a] = d = this.chart.renderer.g().attr({
					zIndex: e || .1
				}).add(h));
				d.addClass("highcharts-" + b + " highcharts-series-" + this.index + " highcharts-" + this.type + "-series " + (n(this.colorIndex) ? "highcharts-color-" + this.colorIndex + " " : "") + (this.options.className || "") + (d.hasClass("highcharts-tracker") ? " highcharts-tracker" : ""), !0);
				d.attr({
					visibility: c
				})[g ? "attr" : "animate"](this.getPlotBox());
				return d
			},
			getPlotBox: function() {
				var a = this.chart,
					b =
					this.xAxis,
					c = this.yAxis;
				a.inverted && (b = c, c = this.xAxis);
				return {
					translateX: b ? b.left : a.plotLeft,
					translateY: c ? c.top : a.plotTop,
					scaleX: 1,
					scaleY: 1
				}
			},
			render: function() {
				var a = this,
					b = a.chart,
					c, e = a.options,
					h = !!a.animate && b.renderer.isSVG && C(e.animation).duration,
					d = a.visible ? "inherit" : "hidden",
					g = e.zIndex,
					f = a.hasRendered,
					k = b.seriesGroup,
					l = b.inverted;
				c = a.plotGroup("group", "series", d, g, k);
				a.markerGroup = a.plotGroup("markerGroup", "markers", d, g, k);
				h && a.animate(!0);
				c.inverted = a.isCartesian ? l : !1;
				a.drawGraph && (a.drawGraph(),
					a.applyZones());
				a.drawDataLabels && a.drawDataLabels();
				a.visible && a.drawPoints();
				a.drawTracker && !1 !== a.options.enableMouseTracking && a.drawTracker();
				a.invertGroups(l);
				!1 === e.clip || a.sharedClipKey || f || c.clip(b.clipRect);
				h && a.animate();
				f || (a.animationTimeout = z(function() {
					a.afterAnimate()
				}, h));
				a.isDirty = !1;
				a.hasRendered = !0
			},
			redraw: function() {
				var a = this.chart,
					b = this.isDirty || this.isDirtyData,
					c = this.group,
					e = this.xAxis,
					h = this.yAxis;
				c && (a.inverted && c.attr({
					width: a.plotWidth,
					height: a.plotHeight
				}), c.animate({
					translateX: I(e &&
						e.left, a.plotLeft),
					translateY: I(h && h.top, a.plotTop)
				}));
				this.translate();
				this.render();
				b && delete this.kdTree
			},
			kdAxisArray: ["clientX", "plotY"],
			searchPoint: function(a, b) {
				var c = this.xAxis,
					e = this.yAxis,
					h = this.chart.inverted;
				return this.searchKDTree({
					clientX: h ? c.len - a.chartY + c.pos : a.chartX - c.pos,
					plotY: h ? e.len - a.chartX + e.pos : a.chartY - e.pos
				}, b)
			},
			buildKDTree: function() {
				function a(c, e, h) {
					var d, g;
					if(g = c && c.length) return d = b.kdAxisArray[e % h], c.sort(function(a, b) {
						return a[d] - b[d]
					}), g = Math.floor(g / 2), {
						point: c[g],
						left: a(c.slice(0, g), e + 1, h),
						right: a(c.slice(g + 1), e + 1, h)
					}
				}
				this.buildingKdTree = !0;
				var b = this,
					c = -1 < b.options.findNearestPointBy.indexOf("y") ? 2 : 1;
				delete b.kdTree;
				z(function() {
					b.kdTree = a(b.getValidPoints(null, !b.directTouch), c, c);
					b.buildingKdTree = !1
				}, b.options.kdNow ? 0 : 1)
			},
			searchKDTree: function(a, b) {
				function c(a, b, f, k) {
					var l = b.point,
						p = e.kdAxisArray[f % k],
						m, w, r = l;
					w = n(a[h]) && n(l[h]) ? Math.pow(a[h] - l[h], 2) : null;
					m = n(a[d]) && n(l[d]) ? Math.pow(a[d] - l[d], 2) : null;
					m = (w || 0) + (m || 0);
					l.dist = n(m) ? Math.sqrt(m) : Number.MAX_VALUE;
					l.distX = n(w) ? Math.sqrt(w) : Number.MAX_VALUE;
					p = a[p] - l[p];
					m = 0 > p ? "left" : "right";
					w = 0 > p ? "right" : "left";
					b[m] && (m = c(a, b[m], f + 1, k), r = m[g] < r[g] ? m : l);
					b[w] && Math.sqrt(p * p) < r[g] && (a = c(a, b[w], f + 1, k), r = a[g] < r[g] ? a : r);
					return r
				}
				var e = this,
					h = this.kdAxisArray[0],
					d = this.kdAxisArray[1],
					g = b ? "distX" : "dist";
				b = -1 < e.options.findNearestPointBy.indexOf("y") ? 2 : 1;
				this.kdTree || this.buildingKdTree || this.buildKDTree();
				if(this.kdTree) return c(a, this.kdTree, b, b)
			}
		})
	})(K);
	(function(a) {
		var y = a.addEvent,
			C = a.animate,
			x = a.Axis,
			f = a.createElement,
			d = a.css,
			v = a.defined,
			t = a.each,
			q = a.erase,
			n = a.extend,
			l = a.fireEvent,
			g = a.inArray,
			r = a.isNumber,
			m = a.isObject,
			k = a.isArray,
			e = a.merge,
			b = a.objectEach,
			c = a.pick,
			h = a.Point,
			D = a.Series,
			I = a.seriesTypes,
			B = a.setAnimation,
			J = a.splat;
		n(a.Chart.prototype, {
			addSeries: function(a, b, e) {
				var h, d = this;
				a && (b = c(b, !0), l(d, "addSeries", {
					options: a
				}, function() {
					h = d.initSeries(a);
					d.isDirtyLegend = !0;
					d.linkSeries();
					b && d.redraw(e)
				}));
				return h
			},
			addAxis: function(a, b, h, d) {
				var g = b ? "xAxis" : "yAxis",
					f = this.options;
				a = e(a, {
					index: this[g].length,
					isX: b
				});
				b = new x(this, a);
				f[g] = J(f[g] || {});
				f[g].push(a);
				c(h, !0) && this.redraw(d);
				return b
			},
			showLoading: function(a) {
				var b = this,
					c = b.options,
					e = b.loadingDiv,
					h = c.loading,
					g = function() {
						e && d(e, {
							left: b.plotLeft + "px",
							top: b.plotTop + "px",
							width: b.plotWidth + "px",
							height: b.plotHeight + "px"
						})
					};
				e || (b.loadingDiv = e = f("div", {
					className: "highcharts-loading highcharts-loading-hidden"
				}, null, b.container), b.loadingSpan = f("span", {
					className: "highcharts-loading-inner"
				}, null, e), y(b, "redraw", g));
				e.className = "highcharts-loading";
				b.loadingSpan.innerHTML =
					a || c.lang.loading;
				d(e, n(h.style, {
					zIndex: 10
				}));
				d(b.loadingSpan, h.labelStyle);
				b.loadingShown || (d(e, {
					opacity: 0,
					display: ""
				}), C(e, {
					opacity: h.style.opacity || .5
				}, {
					duration: h.showDuration || 0
				}));
				b.loadingShown = !0;
				g()
			},
			hideLoading: function() {
				var a = this.options,
					b = this.loadingDiv;
				b && (b.className = "highcharts-loading highcharts-loading-hidden", C(b, {
					opacity: 0
				}, {
					duration: a.loading.hideDuration || 100,
					complete: function() {
						d(b, {
							display: "none"
						})
					}
				}));
				this.loadingShown = !1
			},
			propsRequireDirtyBox: "backgroundColor borderColor borderWidth margin marginTop marginRight marginBottom marginLeft spacing spacingTop spacingRight spacingBottom spacingLeft borderRadius plotBackgroundColor plotBackgroundImage plotBorderColor plotBorderWidth plotShadow shadow".split(" "),
			propsRequireUpdateSeries: "chart.inverted chart.polar chart.ignoreHiddenSeries chart.type colors plotOptions tooltip".split(" "),
			update: function(a, h, d) {
				var f = this,
					k = {
						credits: "addCredits",
						title: "setTitle",
						subtitle: "setSubtitle"
					},
					l = a.chart,
					m, p, n = [];
				if(l) {
					e(!0, f.options.chart, l);
					"className" in l && f.setClassName(l.className);
					if("inverted" in l || "polar" in l) f.propFromSeries(), m = !0;
					"alignTicks" in l && (m = !0);
					b(l, function(a, b) {
						-1 !== g("chart." + b, f.propsRequireUpdateSeries) && (p = !0); - 1 !== g(b, f.propsRequireDirtyBox) &&
							(f.isDirtyBox = !0)
					});
					"style" in l && f.renderer.setStyle(l.style)
				}
				a.colors && (this.options.colors = a.colors);
				a.plotOptions && e(!0, this.options.plotOptions, a.plotOptions);
				b(a, function(a, b) {
					if(f[b] && "function" === typeof f[b].update) f[b].update(a, !1);
					else if("function" === typeof f[k[b]]) f[k[b]](a);
					"chart" !== b && -1 !== g(b, f.propsRequireUpdateSeries) && (p = !0)
				});
				t("xAxis yAxis zAxis series colorAxis pane".split(" "), function(b) {
					a[b] && (t(J(a[b]), function(a, c) {
						(c = v(a.id) && f.get(a.id) || f[b][c]) && c.coll === b && (c.update(a, !1), d && (c.touched = !0));
						if(!c && d)
							if("series" === b) f.addSeries(a, !1).touched = !0;
							else if("xAxis" === b || "yAxis" === b) f.addAxis(a, "xAxis" === b, !1).touched = !0
					}), d && t(f[b], function(a) {
						a.touched ? delete a.touched : n.push(a)
					}))
				});
				t(n, function(a) {
					a.remove(!1)
				});
				m && t(f.axes, function(a) {
					a.update({}, !1)
				});
				p && t(f.series, function(a) {
					a.update({}, !1)
				});
				a.loading && e(!0, f.options.loading, a.loading);
				m = l && l.width;
				l = l && l.height;
				r(m) && m !== f.chartWidth || r(l) && l !== f.chartHeight ? f.setSize(m, l) : c(h, !0) && f.redraw()
			},
			setSubtitle: function(a) {
				this.setTitle(void 0,
					a)
			}
		});
		n(h.prototype, {
			update: function(a, b, e, h) {
				function d() {
					g.applyOptions(a);
					null === g.y && k && (g.graphic = k.destroy());
					m(a, !0) && (k && k.element && a && a.marker && void 0 !== a.marker.symbol && (g.graphic = k.destroy()), a && a.dataLabels && g.dataLabel && (g.dataLabel = g.dataLabel.destroy()), g.connector && (g.connector = g.connector.destroy()));
					l = g.index;
					f.updateParallelArrays(g, l);
					r.data[l] = m(r.data[l], !0) || m(a, !0) ? g.options : a;
					f.isDirty = f.isDirtyData = !0;
					!f.fixedBox && f.hasCartesianSeries && (n.isDirtyBox = !0);
					"point" === r.legendType &&
						(n.isDirtyLegend = !0);
					b && n.redraw(e)
				}
				var g = this,
					f = g.series,
					k = g.graphic,
					l, n = f.chart,
					r = f.options;
				b = c(b, !0);
				!1 === h ? d() : g.firePointEvent("update", {
					options: a
				}, d)
			},
			remove: function(a, b) {
				this.series.removePoint(g(this, this.series.data), a, b)
			}
		});
		n(D.prototype, {
			addPoint: function(a, b, e, h) {
				var g = this.options,
					d = this.data,
					f = this.chart,
					k = this.xAxis,
					k = k && k.hasNames && k.names,
					l = g.data,
					m, n, r = this.xData,
					w, B;
				b = c(b, !0);
				m = {
					series: this
				};
				this.pointClass.prototype.applyOptions.apply(m, [a]);
				B = m.x;
				w = r.length;
				if(this.requireSorting &&
					B < r[w - 1])
					for(n = !0; w && r[w - 1] > B;) w--;
				this.updateParallelArrays(m, "splice", w, 0, 0);
				this.updateParallelArrays(m, w);
				k && m.name && (k[B] = m.name);
				l.splice(w, 0, a);
				n && (this.data.splice(w, 0, null), this.processData());
				"point" === g.legendType && this.generatePoints();
				e && (d[0] && d[0].remove ? d[0].remove(!1) : (d.shift(), this.updateParallelArrays(m, "shift"), l.shift()));
				this.isDirtyData = this.isDirty = !0;
				b && f.redraw(h)
			},
			removePoint: function(a, b, e) {
				var h = this,
					g = h.data,
					d = g[a],
					f = h.points,
					k = h.chart,
					l = function() {
						f && f.length === g.length &&
							f.splice(a, 1);
						g.splice(a, 1);
						h.options.data.splice(a, 1);
						h.updateParallelArrays(d || {
							series: h
						}, "splice", a, 1);
						d && d.destroy();
						h.isDirty = !0;
						h.isDirtyData = !0;
						b && k.redraw()
					};
				B(e, k);
				b = c(b, !0);
				d ? d.firePointEvent("remove", null, l) : l()
			},
			remove: function(a, b, e) {
				function h() {
					g.destroy();
					d.isDirtyLegend = d.isDirtyBox = !0;
					d.linkSeries();
					c(a, !0) && d.redraw(b)
				}
				var g = this,
					d = g.chart;
				!1 !== e ? l(g, "remove", null, h) : h()
			},
			update: function(a, b) {
				var h = this,
					g = h.chart,
					d = h.userOptions,
					f = h.oldType || h.type,
					k = a.type || d.type || g.options.chart.type,
					l = I[f].prototype,
					m, r = ["group", "markerGroup", "dataLabelsGroup"],
					B = ["navigatorSeries", "baseSeries"],
					q = h.finishedAnimating && {
						animation: !1
					};
				if(Object.keys && "data" === Object.keys(a).toString()) return this.setData(a.data, b);
				if(k && k !== f || void 0 !== a.zIndex) r.length = 0;
				B = r.concat(B);
				t(B, function(a) {
					B[a] = h[a];
					delete h[a]
				});
				a = e(d, q, {
					index: h.index,
					pointStart: h.xData[0]
				}, {
					data: h.options.data
				}, a);
				h.remove(!1, null, !1);
				for(m in l) h[m] = void 0;
				n(h, I[k || f].prototype);
				t(B, function(a) {
					h[a] = B[a]
				});
				h.init(g, a);
				h.oldType =
					f;
				g.linkSeries();
				c(b, !0) && g.redraw(!1)
			}
		});
		n(x.prototype, {
			update: function(a, b) {
				var h = this.chart;
				a = h.options[this.coll][this.options.index] = e(this.userOptions, a);
				this.destroy(!0);
				this.init(h, n(a, {
					events: void 0
				}));
				h.isDirtyBox = !0;
				c(b, !0) && h.redraw()
			},
			remove: function(a) {
				for(var b = this.chart, e = this.coll, h = this.series, g = h.length; g--;) h[g] && h[g].remove(!1);
				q(b.axes, this);
				q(b[e], this);
				k(b.options[e]) ? b.options[e].splice(this.options.index, 1) : delete b.options[e];
				t(b[e], function(a, b) {
					a.options.index = b
				});
				this.destroy();
				b.isDirtyBox = !0;
				c(a, !0) && b.redraw()
			},
			setTitle: function(a, b) {
				this.update({
					title: a
				}, b)
			},
			setCategories: function(a, b) {
				this.update({
					categories: a
				}, b)
			}
		})
	})(K);
	(function(a) {
		var y = a.animObject,
			C = a.color,
			x = a.each,
			f = a.extend,
			d = a.isNumber,
			v = a.merge,
			t = a.pick,
			q = a.Series,
			n = a.seriesType,
			l = a.svg;
		n("column", "line", {
			borderRadius: 0,
			crisp: !0,
			groupPadding: .2,
			marker: null,
			pointPadding: .1,
			minPointLength: 0,
			cropThreshold: 50,
			pointRange: null,
			states: {
				hover: {
					halo: !1,
					brightness: .1
				},
				select: {
					color: "#cccccc",
					borderColor: "#000000"
				}
			},
			dataLabels: {
				align: null,
				verticalAlign: null,
				y: null
			},
			softThreshold: !1,
			startFromThreshold: !0,
			stickyTracking: !1,
			tooltip: {
				distance: 6
			},
			threshold: 0,
			borderColor: "#ffffff"
		}, {
			cropShoulder: 0,
			directTouch: !0,
			trackerGroups: ["group", "dataLabelsGroup"],
			negStacks: !0,
			init: function() {
				q.prototype.init.apply(this, arguments);
				var a = this,
					d = a.chart;
				d.hasRendered && x(d.series, function(g) {
					g.type === a.type && (g.isDirty = !0)
				})
			},
			getColumnMetrics: function() {
				var a = this,
					d = a.options,
					f = a.xAxis,
					k = a.yAxis,
					e = f.reversed,
					b, c = {},
					h = 0;
				!1 === d.grouping ?
					h = 1 : x(a.chart.series, function(e) {
						var d = e.options,
							g = e.yAxis,
							f;
						e.type !== a.type || !e.visible && a.chart.options.chart.ignoreHiddenSeries || k.len !== g.len || k.pos !== g.pos || (d.stacking ? (b = e.stackKey, void 0 === c[b] && (c[b] = h++), f = c[b]) : !1 !== d.grouping && (f = h++), e.columnIndex = f)
					});
				var l = Math.min(Math.abs(f.transA) * (f.ordinalSlope || d.pointRange || f.closestPointRange || f.tickInterval || 1), f.len),
					n = l * d.groupPadding,
					B = (l - 2 * n) / (h || 1),
					d = Math.min(d.maxPointWidth || f.len, t(d.pointWidth, B * (1 - 2 * d.pointPadding)));
				a.columnMetrics = {
					width: d,
					offset: (B - d) / 2 + (n + ((a.columnIndex || 0) + (e ? 1 : 0)) * B - l / 2) * (e ? -1 : 1)
				};
				return a.columnMetrics
			},
			crispCol: function(a, d, f, k) {
				var e = this.chart,
					b = this.borderWidth,
					c = -(b % 2 ? .5 : 0),
					b = b % 2 ? .5 : 1;
				e.inverted && e.renderer.isVML && (b += 1);
				this.options.crisp && (f = Math.round(a + f) + c, a = Math.round(a) + c, f -= a);
				k = Math.round(d + k) + b;
				c = .5 >= Math.abs(d) && .5 < k;
				d = Math.round(d) + b;
				k -= d;
				c && k && (--d, k += 1);
				return {
					x: a,
					y: d,
					width: f,
					height: k
				}
			},
			translate: function() {
				var a = this,
					d = a.chart,
					f = a.options,
					k = a.dense = 2 > a.closestPointRange * a.xAxis.transA,
					k = a.borderWidth = t(f.borderWidth, k ? 0 : 1),
					e = a.yAxis,
					b = f.threshold,
					c = a.translatedThreshold = e.getThreshold(b),
					h = t(f.minPointLength, 5),
					l = a.getColumnMetrics(),
					n = l.width,
					B = a.barW = Math.max(n, 1 + 2 * k),
					v = a.pointXOffset = l.offset;
				d.inverted && (c -= .5);
				f.pointPadding && (B = Math.ceil(B));
				q.prototype.translate.apply(a);
				x(a.points, function(g) {
					var f = t(g.yBottom, c),
						k = 999 + Math.abs(f),
						k = Math.min(Math.max(-k, g.plotY), e.len + k),
						l = g.plotX + v,
						m = B,
						r = Math.min(k, f),
						q, p = Math.max(k, f) - r;
					h && Math.abs(p) < h && (p = h, q = !e.reversed && !g.negative ||
						e.reversed && g.negative, g.y === b && a.dataMax <= b && e.min < b && (q = !q), r = Math.abs(r - c) > h ? f - h : c - (q ? h : 0));
					g.barX = l;
					g.pointWidth = n;
					g.tooltipPos = d.inverted ? [e.len + e.pos - d.plotLeft - k, a.xAxis.len - l - m / 2, p] : [l + m / 2, k + e.pos - d.plotTop, p];
					g.shapeType = "rect";
					g.shapeArgs = a.crispCol.apply(a, g.isNull ? [l, c, m, 0] : [l, r, m, p])
				})
			},
			getSymbol: a.noop,
			drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
			drawGraph: function() {
				this.group[this.dense ? "addClass" : "removeClass"]("highcharts-dense-data")
			},
			pointAttribs: function(a, d) {
				var g = this.options,
					f, e = this.pointAttrToOptions || {};
				f = e.stroke || "borderColor";
				var b = e["stroke-width"] || "borderWidth",
					c = a && a.color || this.color,
					h = a && a[f] || g[f] || this.color || c,
					l = a && a[b] || g[b] || this[b] || 0,
					e = g.dashStyle;
				a && this.zones.length && (c = a.getZone(), c = a.options.color || c && c.color || this.color);
				d && (a = v(g.states[d], a.options.states && a.options.states[d] || {}), d = a.brightness, c = a.color || void 0 !== d && C(c).brighten(a.brightness).get() || c, h = a[f] || h, l = a[b] || l, e = a.dashStyle || e);
				f = {
					fill: c,
					stroke: h,
					"stroke-width": l
				};
				e && (f.dashstyle =
					e);
				return f
			},
			drawPoints: function() {
				var a = this,
					f = this.chart,
					l = a.options,
					k = f.renderer,
					e = l.animationLimit || 250,
					b;
				x(a.points, function(c) {
					var h = c.graphic;
					if(d(c.plotY) && null !== c.y) {
						b = c.shapeArgs;
						if(h) h[f.pointCount < e ? "animate" : "attr"](v(b));
						else c.graphic = h = k[c.shapeType](b).add(c.group || a.group);
						l.borderRadius && h.attr({
							r: l.borderRadius
						});
						h.attr(a.pointAttribs(c, c.selected && "select")).shadow(l.shadow, null, l.stacking && !l.borderRadius);
						h.addClass(c.getClassName(), !0)
					} else h && (c.graphic = h.destroy())
				})
			},
			animate: function(a) {
				var d =
					this,
					g = this.yAxis,
					k = d.options,
					e = this.chart.inverted,
					b = {},
					c = e ? "translateX" : "translateY",
					h;
				l && (a ? (b.scaleY = .001, a = Math.min(g.pos + g.len, Math.max(g.pos, g.toPixels(k.threshold))), e ? b.translateX = a - g.len : b.translateY = a, d.group.attr(b)) : (h = d.group.attr(c), d.group.animate({
					scaleY: 1
				}, f(y(d.options.animation), {
					step: function(a, e) {
						b[c] = h + e.pos * (g.pos - h);
						d.group.attr(b)
					}
				})), d.animate = null))
			},
			remove: function() {
				var a = this,
					d = a.chart;
				d.hasRendered && x(d.series, function(d) {
					d.type === a.type && (d.isDirty = !0)
				});
				q.prototype.remove.apply(a,
					arguments)
			}
		})
	})(K);
	(function(a) {
		var y = a.Series;
		a = a.seriesType;
		a("scatter", "line", {
			lineWidth: 0,
			findNearestPointBy: "xy",
			marker: {
				enabled: !0
			},
			tooltip: {
				headerFormat: '\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e \x3cspan style\x3d"font-size: 0.85em"\x3e {series.name}\x3c/span\x3e\x3cbr/\x3e',
				pointFormat: "x: \x3cb\x3e{point.x}\x3c/b\x3e\x3cbr/\x3ey: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3e"
			}
		}, {
			sorted: !1,
			requireSorting: !1,
			noSharedTooltip: !0,
			trackerGroups: ["group", "markerGroup", "dataLabelsGroup"],
			takeOrdinalPosition: !1,
			drawGraph: function() {
				this.options.lineWidth && y.prototype.drawGraph.call(this)
			}
		})
	})(K);
	(function(a) {
		var y = a.addEvent,
			C = a.arrayMax,
			x = a.defined,
			f = a.each,
			d = a.extend,
			v = a.format,
			t = a.map,
			q = a.merge,
			n = a.noop,
			l = a.pick,
			g = a.relativeLength,
			r = a.Series,
			m = a.seriesTypes,
			k = a.stableSort;
		a.distribute = function(a, b) {
			function c(a, b) {
				return a.target - b.target
			}
			var e, d = !0,
				g = a,
				n = [],
				m;
			m = 0;
			for(e = a.length; e--;) m += a[e].size;
			if(m > b) {
				k(a, function(a, b) {
					return(b.rank || 0) - (a.rank || 0)
				});
				for(m = e = 0; m <= b;) m += a[e].size,
					e++;
				n = a.splice(e - 1, a.length)
			}
			k(a, c);
			for(a = t(a, function(a) {
					return {
						size: a.size,
						targets: [a.target],
						align: l(a.align, .5)
					}
				}); d;) {
				for(e = a.length; e--;) d = a[e], m = (Math.min.apply(0, d.targets) + Math.max.apply(0, d.targets)) / 2, d.pos = Math.min(Math.max(0, m - d.size * d.align), b - d.size);
				e = a.length;
				for(d = !1; e--;) 0 < e && a[e - 1].pos + a[e - 1].size > a[e].pos && (a[e - 1].size += a[e].size, a[e - 1].targets = a[e - 1].targets.concat(a[e].targets), a[e - 1].align = .5, a[e - 1].pos + a[e - 1].size > b && (a[e - 1].pos = b - a[e - 1].size), a.splice(e, 1), d = !0)
			}
			e = 0;
			f(a,
				function(a) {
					var b = 0;
					f(a.targets, function() {
						g[e].pos = a.pos + b;
						b += g[e].size;
						e++
					})
				});
			g.push.apply(g, n);
			k(g, c)
		};
		r.prototype.drawDataLabels = function() {
			function e(a, b) {
				var c = b.filter;
				return c ? (b = c.operator, a = a[c.property], c = c.value, "\x3e" === b && a > c || "\x3c" === b && a < c || "\x3e\x3d" === b && a >= c || "\x3c\x3d" === b && a <= c || "\x3d\x3d" === b && a == c || "\x3d\x3d\x3d" === b && a === c ? !0 : !1) : !0
			}
			var b = this,
				c = b.options,
				h = c.dataLabels,
				d = b.points,
				g, k, n = b.hasRendered || 0,
				m, r, t = l(h.defer, !!c.animation),
				w = b.chart.renderer;
			if(h.enabled || b._hasPointLabels) b.dlProcessOptions &&
				b.dlProcessOptions(h), r = b.plotGroup("dataLabelsGroup", "data-labels", t && !n ? "hidden" : "visible", h.zIndex || 6), t && (r.attr({
					opacity: +n
				}), n || y(b, "afterAnimate", function() {
					b.visible && r.show(!0);
					r[c.animation ? "animate" : "attr"]({
						opacity: 1
					}, {
						duration: 200
					})
				})), k = h, f(d, function(d) {
					var f, n = d.dataLabel,
						p, u, B = d.connector,
						z = !n,
						t;
					g = d.dlOptions || d.options && d.options.dataLabels;
					(f = l(g && g.enabled, k.enabled) && !d.isNull) && (f = !0 === e(d, g || h));
					f && (h = q(k, g), p = d.getLabelConfig(), t = h[d.formatPrefix + "Format"] || h.format, m = x(t) ?
						v(t, p) : (h[d.formatPrefix + "Formatter"] || h.formatter).call(p, h), t = h.style, p = h.rotation, t.color = l(h.color, t.color, b.color, "#000000"), "contrast" === t.color && (d.contrastColor = w.getContrast(d.color || b.color), t.color = h.inside || 0 > l(d.labelDistance, h.distance) || c.stacking ? d.contrastColor : "#000000"), c.cursor && (t.cursor = c.cursor), u = {
							fill: h.backgroundColor,
							stroke: h.borderColor,
							"stroke-width": h.borderWidth,
							r: h.borderRadius || 0,
							rotation: p,
							padding: h.padding,
							zIndex: 1
						}, a.objectEach(u, function(a, b) {
							void 0 === a && delete u[b]
						}));
					!n || f && x(m) ? f && x(m) && (n ? u.text = m : (n = d.dataLabel = w[p ? "text" : "label"](m, 0, -9999, h.shape, null, null, h.useHTML, null, "data-label"), n.addClass("highcharts-data-label-color-" + d.colorIndex + " " + (h.className || "") + (h.useHTML ? "highcharts-tracker" : ""))), n.attr(u), n.css(t).shadow(h.shadow), n.added || n.add(r), b.alignDataLabel(d, n, h, null, z)) : (d.dataLabel = n = n.destroy(), B && (d.connector = B.destroy()))
				})
		};
		r.prototype.alignDataLabel = function(a, b, c, h, g) {
			var e = this.chart,
				f = e.inverted,
				k = l(a.dlBox && a.dlBox.centerX, a.plotX, -9999),
				n = l(a.plotY, -9999),
				m = b.getBBox(),
				r, w = c.rotation,
				q = c.align,
				v = this.visible && (a.series.forceDL || e.isInsidePlot(k, Math.round(n), f) || h && e.isInsidePlot(k, f ? h.x + 1 : h.y + h.height - 1, f)),
				t = "justify" === l(c.overflow, "justify");
			if(v && (r = c.style.fontSize, r = e.renderer.fontMetrics(r, b).b, h = d({
					x: f ? this.yAxis.len - n : k,
					y: Math.round(f ? this.xAxis.len - k : n),
					width: 0,
					height: 0
				}, h), d(c, {
					width: m.width,
					height: m.height
				}), w ? (t = !1, k = e.renderer.rotCorr(r, w), k = {
					x: h.x + c.x + h.width / 2 + k.x,
					y: h.y + c.y + {
							top: 0,
							middle: .5,
							bottom: 1
						}[c.verticalAlign] *
						h.height
				}, b[g ? "attr" : "animate"](k).attr({
					align: q
				}), n = (w + 720) % 360, n = 180 < n && 360 > n, "left" === q ? k.y -= n ? m.height : 0 : "center" === q ? (k.x -= m.width / 2, k.y -= m.height / 2) : "right" === q && (k.x -= m.width, k.y -= n ? 0 : m.height)) : (b.align(c, null, h), k = b.alignAttr), t ? a.isLabelJustified = this.justifyDataLabel(b, c, k, m, h, g) : l(c.crop, !0) && (v = e.isInsidePlot(k.x, k.y) && e.isInsidePlot(k.x + m.width, k.y + m.height)), c.shape && !w)) b[g ? "attr" : "animate"]({
				anchorX: f ? e.plotWidth - a.plotY : a.plotX,
				anchorY: f ? e.plotHeight - a.plotX : a.plotY
			});
			v || (b.attr({
					y: -9999
				}),
				b.placed = !1)
		};
		r.prototype.justifyDataLabel = function(a, b, c, d, g, f) {
			var e = this.chart,
				h = b.align,
				k = b.verticalAlign,
				l, n, m = a.box ? 0 : a.padding || 0;
			l = c.x + m;
			0 > l && ("right" === h ? b.align = "left" : b.x = -l, n = !0);
			l = c.x + d.width - m;
			l > e.plotWidth && ("left" === h ? b.align = "right" : b.x = e.plotWidth - l, n = !0);
			l = c.y + m;
			0 > l && ("bottom" === k ? b.verticalAlign = "top" : b.y = -l, n = !0);
			l = c.y + d.height - m;
			l > e.plotHeight && ("top" === k ? b.verticalAlign = "bottom" : b.y = e.plotHeight - l, n = !0);
			n && (a.placed = !f, a.align(b, null, g));
			return n
		};
		m.pie && (m.pie.prototype.drawDataLabels =
			function() {
				var e = this,
					b = e.data,
					c, d = e.chart,
					g = e.options.dataLabels,
					k = l(g.connectorPadding, 10),
					n = l(g.connectorWidth, 1),
					m = d.plotWidth,
					q = d.plotHeight,
					v, t = e.center,
					w = t[2] / 2,
					G = t[1],
					E, H, p, u, y = [
						[],
						[]
					],
					M, O, L, K, A = [0, 0, 0, 0];
				e.visible && (g.enabled || e._hasPointLabels) && (f(b, function(a) {
					a.dataLabel && a.visible && a.dataLabel.shortened && (a.dataLabel.attr({
						width: "auto"
					}).css({
						width: "auto",
						textOverflow: "clip"
					}), a.dataLabel.shortened = !1)
				}), r.prototype.drawDataLabels.apply(e), f(b, function(a) {
					a.dataLabel && a.visible && (y[a.half].push(a),
						a.dataLabel._pos = null)
				}), f(y, function(b, h) {
					var n, r, B = b.length,
						v = [],
						z;
					if(B)
						for(e.sortByAngle(b, h - .5), 0 < e.maxLabelDistance && (n = Math.max(0, G - w - e.maxLabelDistance), r = Math.min(G + w + e.maxLabelDistance, d.plotHeight), f(b, function(a) {
								0 < a.labelDistance && a.dataLabel && (a.top = Math.max(0, G - w - a.labelDistance), a.bottom = Math.min(G + w + a.labelDistance, d.plotHeight), z = a.dataLabel.getBBox().height || 21, a.positionsIndex = v.push({
									target: a.labelPos[1] - a.top + z / 2,
									size: z,
									rank: a.y
								}) - 1)
							}), a.distribute(v, r + z - n)), K = 0; K < B; K++) c = b[K],
							r = c.positionsIndex, p = c.labelPos, E = c.dataLabel, L = !1 === c.visible ? "hidden" : "inherit", O = n = p[1], v && x(v[r]) && (void 0 === v[r].pos ? L = "hidden" : (u = v[r].size, O = c.top + v[r].pos)), delete c.positionIndex, M = g.justify ? t[0] + (h ? -1 : 1) * (w + c.labelDistance) : e.getX(O < c.top + 2 || O > c.bottom - 2 ? n : O, h, c), E._attr = {
								visibility: L,
								align: p[6]
							}, E._pos = {
								x: M + g.x + ({
									left: k,
									right: -k
								}[p[6]] || 0),
								y: O + g.y - 10
							}, p.x = M, p.y = O, l(g.crop, !0) && (H = E.getBBox().width, n = null, M - H < k ? (n = Math.round(H - M + k), A[3] = Math.max(n, A[3])) : M + H > m - k && (n = Math.round(M + H - m + k),
								A[1] = Math.max(n, A[1])), 0 > O - u / 2 ? A[0] = Math.max(Math.round(-O + u / 2), A[0]) : O + u / 2 > q && (A[2] = Math.max(Math.round(O + u / 2 - q), A[2])), E.sideOverflow = n)
				}), 0 === C(A) || this.verifyDataLabelOverflow(A)) && (this.placeDataLabels(), n && f(this.points, function(a) {
					var b;
					v = a.connector;
					if((E = a.dataLabel) && E._pos && a.visible && 0 < a.labelDistance) {
						L = E._attr.visibility;
						if(b = !v) a.connector = v = d.renderer.path().addClass("highcharts-data-label-connector  highcharts-color-" + a.colorIndex).add(e.dataLabelsGroup), v.attr({
							"stroke-width": n,
							stroke: g.connectorColor || a.color || "#666666"
						});
						v[b ? "attr" : "animate"]({
							d: e.connectorPath(a.labelPos)
						});
						v.attr("visibility", L)
					} else v && (a.connector = v.destroy())
				}))
			}, m.pie.prototype.connectorPath = function(a) {
				var b = a.x,
					c = a.y;
				return l(this.options.dataLabels.softConnector, !0) ? ["M", b + ("left" === a[6] ? 5 : -5), c, "C", b, c, 2 * a[2] - a[4], 2 * a[3] - a[5], a[2], a[3], "L", a[4], a[5]] : ["M", b + ("left" === a[6] ? 5 : -5), c, "L", a[2], a[3], "L", a[4], a[5]]
			}, m.pie.prototype.placeDataLabels = function() {
				f(this.points, function(a) {
					var b = a.dataLabel;
					b && a.visible && ((a = b._pos) ? (b.sideOverflow && (b._attr.width = b.getBBox().width - b.sideOverflow, b.css({
						width: b._attr.width + "px",
						textOverflow: "ellipsis"
					}), b.shortened = !0), b.attr(b._attr), b[b.moved ? "animate" : "attr"](a), b.moved = !0) : b && b.attr({
						y: -9999
					}))
				}, this)
			}, m.pie.prototype.alignDataLabel = n, m.pie.prototype.verifyDataLabelOverflow = function(a) {
				var b = this.center,
					c = this.options,
					e = c.center,
					d = c.minSize || 80,
					f, k = null !== c.size;
				k || (null !== e[0] ? f = Math.max(b[2] - Math.max(a[1], a[3]), d) : (f = Math.max(b[2] - a[1] - a[3], d),
					b[0] += (a[3] - a[1]) / 2), null !== e[1] ? f = Math.max(Math.min(f, b[2] - Math.max(a[0], a[2])), d) : (f = Math.max(Math.min(f, b[2] - a[0] - a[2]), d), b[1] += (a[0] - a[2]) / 2), f < b[2] ? (b[2] = f, b[3] = Math.min(g(c.innerSize || 0, f), f), this.translate(b), this.drawDataLabels && this.drawDataLabels()) : k = !0);
				return k
			});
		m.column && (m.column.prototype.alignDataLabel = function(a, b, c, d, g) {
			var e = this.chart.inverted,
				h = a.series,
				f = a.dlBox || a.shapeArgs,
				k = l(a.below, a.plotY > l(this.translatedThreshold, h.yAxis.len)),
				n = l(c.inside, !!this.options.stacking);
			f && (d = q(f), 0 > d.y && (d.height += d.y, d.y = 0), f = d.y + d.height - h.yAxis.len, 0 < f && (d.height -= f), e && (d = {
				x: h.yAxis.len - d.y - d.height,
				y: h.xAxis.len - d.x - d.width,
				width: d.height,
				height: d.width
			}), n || (e ? (d.x += k ? 0 : d.width, d.width = 0) : (d.y += k ? d.height : 0, d.height = 0)));
			c.align = l(c.align, !e || n ? "center" : k ? "right" : "left");
			c.verticalAlign = l(c.verticalAlign, e || n ? "middle" : k ? "top" : "bottom");
			r.prototype.alignDataLabel.call(this, a, b, c, d, g);
			a.isLabelJustified && a.contrastColor && a.dataLabel.css({
				color: a.contrastColor
			})
		})
	})(K);
	(function(a) {
		var y =
			a.Chart,
			C = a.each,
			x = a.objectEach,
			f = a.pick;
		a = a.addEvent;
		a(y.prototype, "render", function() {
			var a = [];
			C(this.labelCollectors || [], function(d) {
				a = a.concat(d())
			});
			C(this.yAxis || [], function(d) {
				d.options.stackLabels && !d.options.stackLabels.allowOverlap && x(d.stacks, function(d) {
					x(d, function(d) {
						a.push(d.label)
					})
				})
			});
			C(this.series || [], function(d) {
				var v = d.options.dataLabels,
					q = d.dataLabelCollections || ["dataLabel"];
				(v.enabled || d._hasPointLabels) && !v.allowOverlap && d.visible && C(q, function(n) {
					C(d.points, function(d) {
						d[n] &&
							(d[n].labelrank = f(d.labelrank, d.shapeArgs && d.shapeArgs.height), a.push(d[n]))
					})
				})
			});
			this.hideOverlappingLabels(a)
		});
		y.prototype.hideOverlappingLabels = function(a) {
			var d = a.length,
				f, q, n, l, g, r, m, k, e, b = function(a, b, d, e, g, f, k, l) {
					return !(g > a + d || g + k < a || f > b + e || f + l < b)
				};
			for(q = 0; q < d; q++)
				if(f = a[q]) f.oldOpacity = f.opacity, f.newOpacity = 1, f.width || (n = f.getBBox(), f.width = n.width, f.height = n.height);
			a.sort(function(a, b) {
				return(b.labelrank || 0) - (a.labelrank || 0)
			});
			for(q = 0; q < d; q++)
				for(n = a[q], f = q + 1; f < d; ++f)
					if(l = a[f], n && l &&
						n !== l && n.placed && l.placed && 0 !== n.newOpacity && 0 !== l.newOpacity && (g = n.alignAttr, r = l.alignAttr, m = n.parentGroup, k = l.parentGroup, e = 2 * (n.box ? 0 : n.padding || 0), g = b(g.x + m.translateX, g.y + m.translateY, n.width - e, n.height - e, r.x + k.translateX, r.y + k.translateY, l.width - e, l.height - e)))(n.labelrank < l.labelrank ? n : l).newOpacity = 0;
			C(a, function(a) {
				var b, c;
				a && (c = a.newOpacity, a.oldOpacity !== c && a.placed && (c ? a.show(!0) : b = function() {
					a.hide()
				}, a.alignAttr.opacity = c, a[a.isOld ? "animate" : "attr"](a.alignAttr, null, b)), a.isOld = !0)
			})
		}
	})(K);
	(function(a) {
		var y = a.addEvent,
			C = a.Chart,
			x = a.createElement,
			f = a.css,
			d = a.defaultOptions,
			v = a.defaultPlotOptions,
			t = a.each,
			q = a.extend,
			n = a.fireEvent,
			l = a.hasTouch,
			g = a.inArray,
			r = a.isObject,
			m = a.Legend,
			k = a.merge,
			e = a.pick,
			b = a.Point,
			c = a.Series,
			h = a.seriesTypes,
			D = a.svg,
			I;
		I = a.TrackerMixin = {
			drawTrackerPoint: function() {
				var a = this,
					b = a.chart.pointer,
					c = function(a) {
						var c = b.getPointFromEvent(a);
						void 0 !== c && (b.isDirectTouch = !0, c.onMouseOver(a))
					};
				t(a.points, function(a) {
					a.graphic && (a.graphic.element.point = a);
					a.dataLabel &&
						(a.dataLabel.div ? a.dataLabel.div.point = a : a.dataLabel.element.point = a)
				});
				a._hasTracking || (t(a.trackerGroups, function(d) {
					if(a[d]) {
						a[d].addClass("highcharts-tracker").on("mouseover", c).on("mouseout", function(a) {
							b.onTrackerMouseOut(a)
						});
						if(l) a[d].on("touchstart", c);
						a.options.cursor && a[d].css(f).css({
							cursor: a.options.cursor
						})
					}
				}), a._hasTracking = !0)
			},
			drawTrackerGraph: function() {
				var a = this,
					b = a.options,
					c = b.trackByArea,
					d = [].concat(c ? a.areaPath : a.graphPath),
					e = d.length,
					h = a.chart,
					g = h.pointer,
					f = h.renderer,
					k = h.options.tooltip.snap,
					n = a.tracker,
					m, r = function() {
						if(h.hoverSeries !== a) a.onMouseOver()
					},
					q = "rgba(192,192,192," + (D ? .0001 : .002) + ")";
				if(e && !c)
					for(m = e + 1; m--;) "M" === d[m] && d.splice(m + 1, 0, d[m + 1] - k, d[m + 2], "L"), (m && "M" === d[m] || m === e) && d.splice(m, 0, "L", d[m - 2] + k, d[m - 1]);
				n ? n.attr({
					d: d
				}) : a.graph && (a.tracker = f.path(d).attr({
					"stroke-linejoin": "round",
					visibility: a.visible ? "visible" : "hidden",
					stroke: q,
					fill: c ? q : "none",
					"stroke-width": a.graph.strokeWidth() + (c ? 0 : 2 * k),
					zIndex: 2
				}).add(a.group), t([a.tracker, a.markerGroup], function(a) {
					a.addClass("highcharts-tracker").on("mouseover",
						r).on("mouseout", function(a) {
						g.onTrackerMouseOut(a)
					});
					b.cursor && a.css({
						cursor: b.cursor
					});
					if(l) a.on("touchstart", r)
				}))
			}
		};
		h.column && (h.column.prototype.drawTracker = I.drawTrackerPoint);
		h.pie && (h.pie.prototype.drawTracker = I.drawTrackerPoint);
		h.scatter && (h.scatter.prototype.drawTracker = I.drawTrackerPoint);
		q(m.prototype, {
			setItemEvents: function(a, b, c) {
				var d = this,
					e = d.chart.renderer.boxWrapper,
					h = "highcharts-legend-" + (a.series ? "point" : "series") + "-active";
				(c ? b : a.legendGroup).on("mouseover", function() {
					a.setState("hover");
					e.addClass(h);
					b.css(d.options.itemHoverStyle)
				}).on("mouseout", function() {
					b.css(k(a.visible ? d.itemStyle : d.itemHiddenStyle));
					e.removeClass(h);
					a.setState()
				}).on("click", function(b) {
					var c = function() {
						a.setVisible && a.setVisible()
					};
					b = {
						browserEvent: b
					};
					a.firePointEvent ? a.firePointEvent("legendItemClick", b, c) : n(a, "legendItemClick", b, c)
				})
			},
			createCheckboxForItem: function(a) {
				a.checkbox = x("input", {
					type: "checkbox",
					checked: a.selected,
					defaultChecked: a.selected
				}, this.options.itemCheckboxStyle, this.chart.container);
				y(a.checkbox, "click", function(b) {
					n(a.series || a, "checkboxClick", {
						checked: b.target.checked,
						item: a
					}, function() {
						a.select()
					})
				})
			}
		});
		d.legend.itemStyle.cursor = "pointer";
		q(C.prototype, {
			showResetZoom: function() {
				var a = this,
					b = d.lang,
					c = a.options.chart.resetZoomButton,
					e = c.theme,
					h = e.states,
					g = "chart" === c.relativeTo ? null : "plotBox";
				this.resetZoomButton = a.renderer.button(b.resetZoom, null, null, function() {
					a.zoomOut()
				}, e, h && h.hover).attr({
					align: c.position.align,
					title: b.resetZoomTitle
				}).addClass("highcharts-reset-zoom").add().align(c.position, !1, g)
			},
			zoomOut: function() {
				var a = this;
				n(a, "selection", {
					resetSelection: !0
				}, function() {
					a.zoom()
				})
			},
			zoom: function(a) {
				var b, c = this.pointer,
					d = !1,
					h;
				!a || a.resetSelection ? (t(this.axes, function(a) {
					b = a.zoom()
				}), c.initiated = !1) : t(a.xAxis.concat(a.yAxis), function(a) {
					var e = a.axis;
					c[e.isXAxis ? "zoomX" : "zoomY"] && (b = e.zoom(a.min, a.max), e.displayBtn && (d = !0))
				});
				h = this.resetZoomButton;
				d && !h ? this.showResetZoom() : !d && r(h) && (this.resetZoomButton = h.destroy());
				b && this.redraw(e(this.options.chart.animation, a && a.animation, 100 >
					this.pointCount))
			},
			pan: function(a, b) {
				var c = this,
					d = c.hoverPoints,
					e;
				d && t(d, function(a) {
					a.setState()
				});
				t("xy" === b ? [1, 0] : [1], function(b) {
					b = c[b ? "xAxis" : "yAxis"][0];
					var d = b.horiz,
						h = a[d ? "chartX" : "chartY"],
						d = d ? "mouseDownX" : "mouseDownY",
						g = c[d],
						f = (b.pointRange || 0) / 2,
						k = b.getExtremes(),
						l = b.toValue(g - h, !0) + f,
						f = b.toValue(g + b.len - h, !0) - f,
						n = f < l,
						g = n ? f : l,
						l = n ? l : f,
						f = Math.min(k.dataMin, b.toValue(b.toPixels(k.min) - b.minPixelPadding)),
						n = Math.max(k.dataMax, b.toValue(b.toPixels(k.max) + b.minPixelPadding)),
						m;
					m = f - g;
					0 < m && (l +=
						m, g = f);
					m = l - n;
					0 < m && (l = n, g -= m);
					b.series.length && g !== k.min && l !== k.max && (b.setExtremes(g, l, !1, !1, {
						trigger: "pan"
					}), e = !0);
					c[d] = h
				});
				e && c.redraw(!1);
				f(c.container, {
					cursor: "move"
				})
			}
		});
		q(b.prototype, {
			select: function(a, b) {
				var c = this,
					d = c.series,
					h = d.chart;
				a = e(a, !c.selected);
				c.firePointEvent(a ? "select" : "unselect", {
					accumulate: b
				}, function() {
					c.selected = c.options.selected = a;
					d.options.data[g(c, d.data)] = c.options;
					c.setState(a && "select");
					b || t(h.getSelectedPoints(), function(a) {
						a.selected && a !== c && (a.selected = a.options.selected = !1, d.options.data[g(a, d.data)] = a.options, a.setState(""), a.firePointEvent("unselect"))
					})
				})
			},
			onMouseOver: function(a) {
				var b = this.series.chart,
					c = b.pointer;
				a = a ? c.normalize(a) : c.getChartCoordinatesFromPoint(this, b.inverted);
				c.runPointActions(a, this)
			},
			onMouseOut: function() {
				var a = this.series.chart;
				this.firePointEvent("mouseOut");
				t(a.hoverPoints || [], function(a) {
					a.setState()
				});
				a.hoverPoints = a.hoverPoint = null
			},
			importEvents: function() {
				if(!this.hasImportedEvents) {
					var b = this,
						c = k(b.series.options.point, b.options).events;
					b.events = c;
					a.objectEach(c, function(a, c) {
						y(b, c, a)
					});
					this.hasImportedEvents = !0
				}
			},
			setState: function(a, b) {
				var c = Math.floor(this.plotX),
					d = this.plotY,
					h = this.series,
					g = h.options.states[a] || {},
					f = v[h.type].marker && h.options.marker,
					k = f && !1 === f.enabled,
					l = f && f.states && f.states[a] || {},
					n = !1 === l.enabled,
					m = h.stateMarkerGraphic,
					r = this.marker || {},
					t = h.chart,
					B = h.halo,
					D, x = f && h.markerAttribs;
				a = a || "";
				if(!(a === this.state && !b || this.selected && "select" !== a || !1 === g.enabled || a && (n || k && !1 === l.enabled) || a && r.states && r.states[a] &&
						!1 === r.states[a].enabled)) {
					x && (D = h.markerAttribs(this, a));
					if(this.graphic) this.state && this.graphic.removeClass("highcharts-point-" + this.state), a && this.graphic.addClass("highcharts-point-" + a), this.graphic.animate(h.pointAttribs(this, a), e(t.options.chart.animation, g.animation)), D && this.graphic.animate(D, e(t.options.chart.animation, l.animation, f.animation)), m && m.hide();
					else {
						if(a && l) {
							f = r.symbol || h.symbol;
							m && m.currentSymbol !== f && (m = m.destroy());
							if(m) m[b ? "animate" : "attr"]({
								x: D.x,
								y: D.y
							});
							else f && (h.stateMarkerGraphic =
								m = t.renderer.symbol(f, D.x, D.y, D.width, D.height).add(h.markerGroup), m.currentSymbol = f);
							m && m.attr(h.pointAttribs(this, a))
						}
						m && (m[a && t.isInsidePlot(c, d, t.inverted) ? "show" : "hide"](), m.element.point = this)
					}(c = g.halo) && c.size ? (B || (h.halo = B = t.renderer.path().add((this.graphic || m).parentGroup)), B[b ? "animate" : "attr"]({
						d: this.haloPath(c.size)
					}), B.attr({
						"class": "highcharts-halo highcharts-color-" + e(this.colorIndex, h.colorIndex)
					}), B.point = this, B.attr(q({
							fill: this.color || h.color,
							"fill-opacity": c.opacity,
							zIndex: -1
						},
						c.attributes))) : B && B.point && B.point.haloPath && B.animate({
						d: B.point.haloPath(0)
					});
					this.state = a
				}
			},
			haloPath: function(a) {
				return this.series.chart.renderer.symbols.circle(Math.floor(this.plotX) - a, this.plotY - a, 2 * a, 2 * a)
			}
		});
		q(c.prototype, {
			onMouseOver: function() {
				var a = this.chart,
					b = a.hoverSeries;
				if(b && b !== this) b.onMouseOut();
				this.options.events.mouseOver && n(this, "mouseOver");
				this.setState("hover");
				a.hoverSeries = this
			},
			onMouseOut: function() {
				var a = this.options,
					b = this.chart,
					c = b.tooltip,
					d = b.hoverPoint;
				b.hoverSeries =
					null;
				if(d) d.onMouseOut();
				this && a.events.mouseOut && n(this, "mouseOut");
				!c || this.stickyTracking || c.shared && !this.noSharedTooltip || c.hide();
				this.setState()
			},
			setState: function(a) {
				var b = this,
					c = b.options,
					d = b.graph,
					h = c.states,
					g = c.lineWidth,
					c = 0;
				a = a || "";
				if(b.state !== a && (t([b.group, b.markerGroup, b.dataLabelsGroup], function(c) {
						c && (b.state && c.removeClass("highcharts-series-" + b.state), a && c.addClass("highcharts-series-" + a))
					}), b.state = a, !h[a] || !1 !== h[a].enabled) && (a && (g = h[a].lineWidth || g + (h[a].lineWidthPlus || 0)),
						d && !d.dashstyle))
					for(g = {
							"stroke-width": g
						}, d.animate(g, e(b.chart.options.chart.animation, h[a] && h[a].animation)); b["zone-graph-" + c];) b["zone-graph-" + c].attr(g), c += 1
			},
			setVisible: function(a, b) {
				var c = this,
					d = c.chart,
					e = c.legendItem,
					h, g = d.options.chart.ignoreHiddenSeries,
					f = c.visible;
				h = (c.visible = a = c.options.visible = c.userOptions.visible = void 0 === a ? !f : a) ? "show" : "hide";
				t(["group", "dataLabelsGroup", "markerGroup", "tracker", "tt"], function(a) {
					if(c[a]) c[a][h]()
				});
				if(d.hoverSeries === c || (d.hoverPoint && d.hoverPoint.series) ===
					c) c.onMouseOut();
				e && d.legend.colorizeItem(c, a);
				c.isDirty = !0;
				c.options.stacking && t(d.series, function(a) {
					a.options.stacking && a.visible && (a.isDirty = !0)
				});
				t(c.linkedSeries, function(b) {
					b.setVisible(a, !1)
				});
				g && (d.isDirtyBox = !0);
				!1 !== b && d.redraw();
				n(c, h)
			},
			show: function() {
				this.setVisible(!0)
			},
			hide: function() {
				this.setVisible(!1)
			},
			select: function(a) {
				this.selected = a = void 0 === a ? !this.selected : a;
				this.checkbox && (this.checkbox.checked = a);
				n(this, a ? "select" : "unselect")
			},
			drawTracker: I.drawTrackerGraph
		})
	})(K);
	(function(a) {
		var y =
			a.Chart,
			C = a.each,
			x = a.inArray,
			f = a.isArray,
			d = a.isObject,
			v = a.pick,
			t = a.splat;
		y.prototype.setResponsive = function(d) {
			var f = this.options.responsive,
				l = [],
				g = this.currentResponsive;
			f && f.rules && C(f.rules, function(g) {
				void 0 === g._id && (g._id = a.uniqueKey());
				this.matchResponsiveRule(g, l, d)
			}, this);
			var r = a.merge.apply(0, a.map(l, function(d) {
					return a.find(f.rules, function(a) {
						return a._id === d
					}).chartOptions
				})),
				l = l.toString() || void 0;
			l !== (g && g.ruleIds) && (g && this.update(g.undoOptions, d), l ? (this.currentResponsive = {
				ruleIds: l,
				mergedOptions: r,
				undoOptions: this.currentOptions(r)
			}, this.update(r, d)) : this.currentResponsive = void 0)
		};
		y.prototype.matchResponsiveRule = function(a, d) {
			var f = a.condition;
			(f.callback || function() {
				return this.chartWidth <= v(f.maxWidth, Number.MAX_VALUE) && this.chartHeight <= v(f.maxHeight, Number.MAX_VALUE) && this.chartWidth >= v(f.minWidth, 0) && this.chartHeight >= v(f.minHeight, 0)
			}).call(this) && d.push(a._id)
		};
		y.prototype.currentOptions = function(q) {
			function n(g, l, m, k) {
				var e;
				a.objectEach(g, function(a, c) {
					if(!k && -1 < x(c, ["series", "xAxis", "yAxis"]))
						for(a = t(a), m[c] = [], e = 0; e < a.length; e++) l[c][e] && (m[c][e] = {}, n(a[e], l[c][e], m[c][e], k + 1));
					else d(a) ? (m[c] = f(a) ? [] : {}, n(a, l[c] || {}, m[c], k + 1)) : m[c] = l[c] || null
				})
			}
			var l = {};
			n(q, this.options, l, 0);
			return l
		}
	})(K);
	(function(a) {
		var y = a.Axis,
			C = a.each,
			x = a.pick;
		a = a.wrap;
		a(y.prototype, "getSeriesExtremes", function(a) {
			var d = this.isXAxis,
				f, t, q = [],
				n;
			d && C(this.series, function(a, d) {
				a.useMapGeometry && (q[d] = a.xData, a.xData = [])
			});
			a.call(this);
			d && (f = x(this.dataMin, Number.MAX_VALUE), t = x(this.dataMax, -Number.MAX_VALUE), C(this.series, function(a, d) {
				a.useMapGeometry && (f = Math.min(f, x(a.minX, f)), t = Math.max(t, x(a.maxX, t)), a.xData = q[d], n = !0)
			}), n && (this.dataMin = f, this.dataMax = t))
		});
		a(y.prototype, "setAxisTranslation", function(a) {
			var d = this.chart,
				f = d.plotWidth / d.plotHeight,
				d = d.xAxis[0],
				t;
			a.call(this);
			"yAxis" === this.coll && void 0 !== d.transA && C(this.series, function(a) {
				a.preserveAspectRatio && (t = !0)
			});
			if(t && (this.transA = d.transA = Math.min(this.transA, d.transA), a = f / ((d.max - d.min) / (this.max - this.min)), a = 1 > a ? this :
					d, f = (a.max - a.min) * a.transA, a.pixelPadding = a.len - f, a.minPixelPadding = a.pixelPadding / 2, f = a.fixTo)) {
				f = f[1] - a.toValue(f[0], !0);
				f *= a.transA;
				if(Math.abs(f) > a.minPixelPadding || a.min === a.dataMin && a.max === a.dataMax) f = 0;
				a.minPixelPadding -= f
			}
		});
		a(y.prototype, "render", function(a) {
			a.call(this);
			this.fixTo = null
		})
	})(K);
	(function(a) {
		var y = a.Axis,
			C = a.Chart,
			x = a.color,
			f, d = a.each,
			v = a.extend,
			t = a.isNumber,
			q = a.Legend,
			n = a.LegendSymbolMixin,
			l = a.noop,
			g = a.merge,
			r = a.pick,
			m = a.wrap;
		a.ColorAxis || (f = a.ColorAxis = function() {
			this.init.apply(this,
				arguments)
		}, v(f.prototype, y.prototype), v(f.prototype, {
			defaultColorAxisOptions: {
				lineWidth: 0,
				minPadding: 0,
				maxPadding: 0,
				gridLineWidth: 1,
				tickPixelInterval: 72,
				startOnTick: !0,
				endOnTick: !0,
				offset: 0,
				marker: {
					animation: {
						duration: 50
					},
					width: .01,
					color: "#999999"
				},
				labels: {
					overflow: "justify",
					rotation: 0
				},
				minColor: "#e6ebf5",
				maxColor: "#003399",
				tickLength: 5,
				showInLegend: !0
			},
			keepProps: ["legendGroup", "legendItemHeight", "legendItemWidth", "legendItem", "legendSymbol"].concat(y.prototype.keepProps),
			init: function(a, d) {
				var b =
					"vertical" !== a.options.legend.layout,
					c;
				this.coll = "colorAxis";
				c = g(this.defaultColorAxisOptions, {
					side: b ? 2 : 1,
					reversed: !b
				}, d, {
					opposite: !b,
					showEmpty: !1,
					title: null
				});
				y.prototype.init.call(this, a, c);
				d.dataClasses && this.initDataClasses(d);
				this.initStops();
				this.horiz = b;
				this.zoomEnabled = !1;
				this.defaultLegendLength = 200
			},
			initDataClasses: function(a) {
				var e = this.chart,
					b, c = 0,
					h = e.options.chart.colorCount,
					f = this.options,
					k = a.dataClasses.length;
				this.dataClasses = b = [];
				this.legendItems = [];
				d(a.dataClasses, function(a, d) {
					a =
						g(a);
					b.push(a);
					a.color || ("category" === f.dataClassColor ? (d = e.options.colors, h = d.length, a.color = d[c], a.colorIndex = c, c++, c === h && (c = 0)) : a.color = x(f.minColor).tweenTo(x(f.maxColor), 2 > k ? .5 : d / (k - 1)))
				})
			},
			setTickPositions: function() {
				if(!this.dataClasses) return y.prototype.setTickPositions.call(this)
			},
			initStops: function() {
				this.stops = this.options.stops || [
					[0, this.options.minColor],
					[1, this.options.maxColor]
				];
				d(this.stops, function(a) {
					a.color = x(a[1])
				})
			},
			setOptions: function(a) {
				y.prototype.setOptions.call(this, a);
				this.options.crosshair = this.options.marker
			},
			setAxisSize: function() {
				var a = this.legendSymbol,
					d = this.chart,
					b = d.options.legend || {},
					c, h;
				a ? (this.left = b = a.attr("x"), this.top = c = a.attr("y"), this.width = h = a.attr("width"), this.height = a = a.attr("height"), this.right = d.chartWidth - b - h, this.bottom = d.chartHeight - c - a, this.len = this.horiz ? h : a, this.pos = this.horiz ? b : c) : this.len = (this.horiz ? b.symbolWidth : b.symbolHeight) || this.defaultLegendLength
			},
			normalizedValue: function(a) {
				this.isLog && (a = this.val2lin(a));
				return 1 - (this.max -
					a) / (this.max - this.min || 1)
			},
			toColor: function(a, d) {
				var b = this.stops,
					c, e, g = this.dataClasses,
					f, k;
				if(g)
					for(k = g.length; k--;) {
						if(f = g[k], c = f.from, b = f.to, (void 0 === c || a >= c) && (void 0 === b || a <= b)) {
							e = f.color;
							d && (d.dataClass = k, d.colorIndex = f.colorIndex);
							break
						}
					} else {
						a = this.normalizedValue(a);
						for(k = b.length; k-- && !(a > b[k][0]););
						c = b[k] || b[k + 1];
						b = b[k + 1] || c;
						a = 1 - (b[0] - a) / (b[0] - c[0] || 1);
						e = c.color.tweenTo(b.color, a)
					}
				return e
			},
			getOffset: function() {
				var a = this.legendGroup,
					d = this.chart.axisOffset[this.side];
				a && (this.axisParent =
					a, y.prototype.getOffset.call(this), this.added || (this.added = !0, this.labelLeft = 0, this.labelRight = this.width), this.chart.axisOffset[this.side] = d)
			},
			setLegendColor: function() {
				var a, d = this.reversed;
				a = d ? 1 : 0;
				d = d ? 0 : 1;
				a = this.horiz ? [a, 0, d, 0] : [0, d, 0, a];
				this.legendColor = {
					linearGradient: {
						x1: a[0],
						y1: a[1],
						x2: a[2],
						y2: a[3]
					},
					stops: this.stops
				}
			},
			drawLegendSymbol: function(a, d) {
				var b = a.padding,
					c = a.options,
					e = this.horiz,
					g = r(c.symbolWidth, e ? this.defaultLegendLength : 12),
					f = r(c.symbolHeight, e ? 12 : this.defaultLegendLength),
					k = r(c.labelPadding,
						e ? 16 : 30),
					c = r(c.itemDistance, 10);
				this.setLegendColor();
				d.legendSymbol = this.chart.renderer.rect(0, a.baseline - 11, g, f).attr({
					zIndex: 1
				}).add(d.legendGroup);
				this.legendItemWidth = g + b + (e ? c : k);
				this.legendItemHeight = f + b + (e ? k : 0)
			},
			setState: l,
			visible: !0,
			setVisible: l,
			getSeriesExtremes: function() {
				var a = this.series,
					d = a.length;
				this.dataMin = Infinity;
				for(this.dataMax = -Infinity; d--;) void 0 !== a[d].valueMin && (this.dataMin = Math.min(this.dataMin, a[d].valueMin), this.dataMax = Math.max(this.dataMax, a[d].valueMax))
			},
			drawCrosshair: function(a,
				d) {
				var b = d && d.plotX,
					c = d && d.plotY,
					e, g = this.pos,
					f = this.len;
				d && (e = this.toPixels(d[d.series.colorKey]), e < g ? e = g - 2 : e > g + f && (e = g + f + 2), d.plotX = e, d.plotY = this.len - e, y.prototype.drawCrosshair.call(this, a, d), d.plotX = b, d.plotY = c, this.cross && (this.cross.addClass("highcharts-coloraxis-marker").add(this.legendGroup), this.cross.attr({
					fill: this.crosshair.color
				})))
			},
			getPlotLinePath: function(a, d, b, c, h) {
				return t(h) ? this.horiz ? ["M", h - 4, this.top - 6, "L", h + 4, this.top - 6, h, this.top, "Z"] : ["M", this.left, h, "L", this.left - 6, h + 6,
					this.left - 6, h - 6, "Z"
				] : y.prototype.getPlotLinePath.call(this, a, d, b, c)
			},
			update: function(a, e) {
				var b = this.chart,
					c = b.legend;
				d(this.series, function(a) {
					a.isDirtyData = !0
				});
				a.dataClasses && c.allItems && (d(c.allItems, function(a) {
					a.isDataClass && a.legendGroup && a.legendGroup.destroy()
				}), b.isDirtyLegend = !0);
				b.options[this.coll] = g(this.userOptions, a);
				y.prototype.update.call(this, a, e);
				this.legendItem && (this.setLegendColor(), c.colorizeItem(this, !0))
			},
			remove: function() {
				this.legendItem && this.chart.legend.destroyItem(this);
				y.prototype.remove.call(this)
			},
			getDataClassLegendSymbols: function() {
				var g = this,
					e = this.chart,
					b = this.legendItems,
					c = e.options.legend,
					h = c.valueDecimals,
					f = c.valueSuffix || "",
					m;
				b.length || d(this.dataClasses, function(c, k) {
					var r = !0,
						q = c.from,
						t = c.to;
					m = "";
					void 0 === q ? m = "\x3c " : void 0 === t && (m = "\x3e ");
					void 0 !== q && (m += a.numberFormat(q, h) + f);
					void 0 !== q && void 0 !== t && (m += " - ");
					void 0 !== t && (m += a.numberFormat(t, h) + f);
					b.push(v({
						chart: e,
						name: m,
						options: {},
						drawLegendSymbol: n.drawRectangle,
						visible: !0,
						setState: l,
						isDataClass: !0,
						setVisible: function() {
							r = this.visible = !r;
							d(g.series, function(a) {
								d(a.points, function(a) {
									a.dataClass === k && a.setVisible(r)
								})
							});
							e.legend.colorizeItem(this, r)
						}
					}, c))
				});
				return b
			},
			name: ""
		}), d(["fill", "stroke"], function(d) {
			a.Fx.prototype[d + "Setter"] = function() {
				this.elem.attr(d, x(this.start).tweenTo(x(this.end), this.pos), null, !0)
			}
		}), m(C.prototype, "getAxes", function(a) {
			var d = this.options.colorAxis;
			a.call(this);
			this.colorAxis = [];
			d && new f(this, d)
		}), m(q.prototype, "getAllItems", function(a) {
			var e = [],
				b = this.chart.colorAxis[0];
			b && b.options && (b.options.showInLegend && (b.options.dataClasses ? e = e.concat(b.getDataClassLegendSymbols()) : e.push(b)), d(b.series, function(a) {
				a.options.showInLegend = !1
			}));
			return e.concat(a.call(this))
		}), m(q.prototype, "colorizeItem", function(a, d, b) {
			a.call(this, d, b);
			b && d.legendColor && d.legendSymbol.attr({
				fill: d.legendColor
			})
		}), m(q.prototype, "update", function(a) {
			a.apply(this, [].slice.call(arguments, 1));
			this.chart.colorAxis[0] && this.chart.colorAxis[0].update({}, arguments[2])
		}))
	})(K);
	(function(a) {
		var y = a.defined,
			C = a.each,
			x = a.noop,
			f = a.seriesTypes;
		a.colorPointMixin = {
			isValid: function() {
				return null !== this.value
			},
			setVisible: function(a) {
				var d = this,
					f = a ? "show" : "hide";
				C(["graphic", "dataLabel"], function(a) {
					if(d[a]) d[a][f]()
				})
			},
			setState: function(d) {
				a.Point.prototype.setState.call(this, d);
				this.graphic && this.graphic.attr({
					zIndex: "hover" === d ? 1 : 0
				})
			}
		};
		a.colorSeriesMixin = {
			pointArrayMap: ["value"],
			axisTypes: ["xAxis", "yAxis", "colorAxis"],
			optionalAxis: "colorAxis",
			trackerGroups: ["group", "markerGroup", "dataLabelsGroup"],
			getSymbol: x,
			parallelArrays: ["x", "y", "value"],
			colorKey: "value",
			pointAttribs: f.column.prototype.pointAttribs,
			translateColors: function() {
				var a = this,
					f = this.options.nullColor,
					t = this.colorAxis,
					q = this.colorKey;
				C(this.data, function(d) {
					var l = d[q];
					if(l = d.options.color || (d.isNull ? f : t && void 0 !== l ? t.toColor(l, d) : d.color || a.color)) d.color = l
				})
			},
			colorAttribs: function(a) {
				var d = {};
				y(a.color) && (d[this.colorProp || "fill"] = a.color);
				return d
			}
		}
	})(K);
	(function(a) {
		function y(a) {
			a && (a.preventDefault && a.preventDefault(), a.stopPropagation &&
				a.stopPropagation(), a.cancelBubble = !0)
		}

		function C(a) {
			this.init(a)
		}
		var x = a.addEvent,
			f = a.Chart,
			d = a.doc,
			v = a.each,
			t = a.extend,
			q = a.merge,
			n = a.pick,
			l = a.wrap;
		C.prototype.init = function(a) {
			this.chart = a;
			a.mapNavButtons = []
		};
		C.prototype.update = function(d) {
			var g = this.chart,
				f = g.options.mapNavigation,
				k, e, b, c, h, l = function(a) {
					this.handler.call(g, a);
					y(a)
				},
				v = g.mapNavButtons;
			d && (f = g.options.mapNavigation = q(g.options.mapNavigation, d));
			for(; v.length;) v.pop().destroy();
			n(f.enableButtons, f.enabled) && !g.renderer.forExport &&
				a.objectEach(f.buttons, function(a, d) {
					k = q(f.buttonOptions, a);
					e = k.theme;
					e.style = q(k.theme.style, k.style);
					c = (b = e.states) && b.hover;
					h = b && b.select;
					a = g.renderer.button(k.text, 0, 0, l, e, c, h, 0, "zoomIn" === d ? "topbutton" : "bottombutton").addClass("highcharts-map-navigation").attr({
						width: k.width,
						height: k.height,
						title: g.options.lang[d],
						padding: k.padding,
						zIndex: 5
					}).add();
					a.handler = k.onclick;
					a.align(t(k, {
						width: a.width,
						height: 2 * a.height
					}), null, k.alignTo);
					x(a.element, "dblclick", y);
					v.push(a)
				});
			this.updateEvents(f)
		};
		C.prototype.updateEvents =
			function(a) {
				var g = this.chart;
				n(a.enableDoubleClickZoom, a.enabled) || a.enableDoubleClickZoomTo ? this.unbindDblClick = this.unbindDblClick || x(g.container, "dblclick", function(a) {
					g.pointer.onContainerDblClick(a)
				}) : this.unbindDblClick && (this.unbindDblClick = this.unbindDblClick());
				n(a.enableMouseWheelZoom, a.enabled) ? this.unbindMouseWheel = this.unbindMouseWheel || x(g.container, void 0 === d.onmousewheel ? "DOMMouseScroll" : "mousewheel", function(a) {
						g.pointer.onContainerMouseWheel(a);
						y(a);
						return !1
					}) : this.unbindMouseWheel &&
					(this.unbindMouseWheel = this.unbindMouseWheel())
			};
		t(f.prototype, {
			fitToBox: function(a, d) {
				v([
					["x", "width"],
					["y", "height"]
				], function(g) {
					var f = g[0];
					g = g[1];
					a[f] + a[g] > d[f] + d[g] && (a[g] > d[g] ? (a[g] = d[g], a[f] = d[f]) : a[f] = d[f] + d[g] - a[g]);
					a[g] > d[g] && (a[g] = d[g]);
					a[f] < d[f] && (a[f] = d[f])
				});
				return a
			},
			mapZoom: function(a, d, f, k, e) {
				var b = this.xAxis[0],
					c = b.max - b.min,
					h = n(d, b.min + c / 2),
					g = c * a,
					c = this.yAxis[0],
					l = c.max - c.min,
					m = n(f, c.min + l / 2),
					l = l * a,
					h = this.fitToBox({
						x: h - g * (k ? (k - b.pos) / b.len : .5),
						y: m - l * (e ? (e - c.pos) / c.len : .5),
						width: g,
						height: l
					}, {
						x: b.dataMin,
						y: c.dataMin,
						width: b.dataMax - b.dataMin,
						height: c.dataMax - c.dataMin
					}),
					g = h.x <= b.dataMin && h.width >= b.dataMax - b.dataMin && h.y <= c.dataMin && h.height >= c.dataMax - c.dataMin;
				k && (b.fixTo = [k - b.pos, d]);
				e && (c.fixTo = [e - c.pos, f]);
				void 0 === a || g ? (b.setExtremes(void 0, void 0, !1), c.setExtremes(void 0, void 0, !1)) : (b.setExtremes(h.x, h.x + h.width, !1), c.setExtremes(h.y, h.y + h.height, !1));
				this.redraw()
			}
		});
		l(f.prototype, "render", function(a) {
			this.mapNavigation = new C(this);
			this.mapNavigation.update();
			a.call(this)
		})
	})(K);
	(function(a) {
		var y = a.extend,
			C = a.pick,
			x = a.Pointer;
		a = a.wrap;
		y(x.prototype, {
			onContainerDblClick: function(a) {
				var d = this.chart;
				a = this.normalize(a);
				d.options.mapNavigation.enableDoubleClickZoomTo ? d.pointer.inClass(a.target, "highcharts-tracker") && d.hoverPoint && d.hoverPoint.zoomTo() : d.isInsidePlot(a.chartX - d.plotLeft, a.chartY - d.plotTop) && d.mapZoom(.5, d.xAxis[0].toValue(a.chartX), d.yAxis[0].toValue(a.chartY), a.chartX, a.chartY)
			},
			onContainerMouseWheel: function(a) {
				var d = this.chart,
					f;
				a = this.normalize(a);
				f = a.detail ||
					-(a.wheelDelta / 120);
				d.isInsidePlot(a.chartX - d.plotLeft, a.chartY - d.plotTop) && d.mapZoom(Math.pow(d.options.mapNavigation.mouseWheelSensitivity, f), d.xAxis[0].toValue(a.chartX), d.yAxis[0].toValue(a.chartY), a.chartX, a.chartY)
			}
		});
		a(x.prototype, "zoomOption", function(a) {
			var d = this.chart.options.mapNavigation;
			C(d.enableTouchZoom, d.enabled) && (this.chart.options.chart.pinchType = "xy");
			a.apply(this, [].slice.call(arguments, 1))
		});
		a(x.prototype, "pinchTranslate", function(a, d, v, t, q, n, l) {
			a.call(this, d, v, t, q, n, l);
			"map" ===
			this.chart.options.chart.type && this.hasZoom && (a = t.scaleX > t.scaleY, this.pinchTranslateDirection(!a, d, v, t, q, n, l, a ? t.scaleX : t.scaleY))
		})
	})(K);
	(function(a) {
		var y = a.colorPointMixin,
			C = a.each,
			x = a.extend,
			f = a.isNumber,
			d = a.map,
			v = a.merge,
			t = a.noop,
			q = a.pick,
			n = a.isArray,
			l = a.Point,
			g = a.Series,
			r = a.seriesType,
			m = a.seriesTypes,
			k = a.splat,
			e = void 0 !== a.doc.documentElement.style.vectorEffect;
		r("map", "scatter", {
			allAreas: !0,
			animation: !1,
			nullColor: "#f7f7f7",
			borderColor: "#cccccc",
			borderWidth: 1,
			marker: null,
			stickyTracking: !1,
			joinBy: "hc-key",
			dataLabels: {
				formatter: function() {
					return this.point.value
				},
				inside: !0,
				verticalAlign: "middle",
				crop: !1,
				overflow: !1,
				padding: 0
			},
			turboThreshold: 0,
			tooltip: {
				followPointer: !0,
				pointFormat: "{point.name}: {point.value}\x3cbr/\x3e"
			},
			states: {
				normal: {
					animation: !0
				},
				hover: {
					halo: null,
					brightness: .2
				},
				select: {
					color: "#cccccc"
				}
			}
		}, v(a.colorSeriesMixin, {
			type: "map",
			getExtremesFromAll: !0,
			useMapGeometry: !0,
			forceDL: !0,
			searchPoint: t,
			directTouch: !0,
			preserveAspectRatio: !0,
			pointArrayMap: ["value"],
			getBox: function(b) {
				var c =
					Number.MAX_VALUE,
					d = -c,
					e = c,
					g = -c,
					k = c,
					l = c,
					n = this.xAxis,
					m = this.yAxis,
					r;
				C(b || [], function(b) {
					if(b.path) {
						"string" === typeof b.path && (b.path = a.splitPath(b.path));
						var h = b.path || [],
							n = h.length,
							m = !1,
							p = -c,
							u = c,
							t = -c,
							v = c,
							w = b.properties;
						if(!b._foundBox) {
							for(; n--;) f(h[n]) && (m ? (p = Math.max(p, h[n]), u = Math.min(u, h[n])) : (t = Math.max(t, h[n]), v = Math.min(v, h[n])), m = !m);
							b._midX = u + (p - u) * q(b.middleX, w && w["hc-middle-x"], .5);
							b._midY = v + (t - v) * q(b.middleY, w && w["hc-middle-y"], .5);
							b._maxX = p;
							b._minX = u;
							b._maxY = t;
							b._minY = v;
							b.labelrank = q(b.labelrank,
								(p - u) * (t - v));
							b._foundBox = !0
						}
						d = Math.max(d, b._maxX);
						e = Math.min(e, b._minX);
						g = Math.max(g, b._maxY);
						k = Math.min(k, b._minY);
						l = Math.min(b._maxX - b._minX, b._maxY - b._minY, l);
						r = !0
					}
				});
				r && (this.minY = Math.min(k, q(this.minY, c)), this.maxY = Math.max(g, q(this.maxY, -c)), this.minX = Math.min(e, q(this.minX, c)), this.maxX = Math.max(d, q(this.maxX, -c)), n && void 0 === n.options.minRange && (n.minRange = Math.min(5 * l, (this.maxX - this.minX) / 5, n.minRange || c)), m && void 0 === m.options.minRange && (m.minRange = Math.min(5 * l, (this.maxY - this.minY) / 5,
					m.minRange || c)))
			},
			getExtremes: function() {
				g.prototype.getExtremes.call(this, this.valueData);
				this.chart.hasRendered && this.isDirtyData && this.getBox(this.options.data);
				this.valueMin = this.dataMin;
				this.valueMax = this.dataMax;
				this.dataMin = this.minY;
				this.dataMax = this.maxY
			},
			translatePath: function(a) {
				var b = !1,
					d = this.xAxis,
					e = this.yAxis,
					g = d.min,
					k = d.transA,
					d = d.minPixelPadding,
					l = e.min,
					n = e.transA,
					e = e.minPixelPadding,
					m, r = [];
				if(a)
					for(m = a.length; m--;) f(a[m]) ? (r[m] = b ? (a[m] - g) * k + d : (a[m] - l) * n + e, b = !b) : r[m] = a[m];
				return r
			},
			setData: function(b, c, e, l) {
				var h = this.options,
					m = this.chart.options.chart,
					r = m && m.map,
					q = h.mapData,
					t = h.joinBy,
					x = null === t,
					w = h.keys || this.pointArrayMap,
					D = [],
					y = {},
					H = this.chart.mapTransforms;
				!q && r && (q = "string" === typeof r ? a.maps[r] : r);
				x && (t = "_i");
				t = this.joinBy = k(t);
				t[1] || (t[1] = t[0]);
				b && C(b, function(a, c) {
					var d = 0;
					if(f(a)) b[c] = {
						value: a
					};
					else if(n(a)) {
						b[c] = {};
						!h.keys && a.length > w.length && "string" === typeof a[0] && (b[c]["hc-key"] = a[0], ++d);
						for(var e = 0; e < w.length; ++e, ++d) w[e] && (b[c][w[e]] = a[d])
					}
					x && (b[c]._i = c)
				});
				this.getBox(b);
				(this.chart.mapTransforms = H = m && m.mapTransforms || q && q["hc-transform"] || H) && a.objectEach(H, function(a) {
					a.rotation && (a.cosAngle = Math.cos(a.rotation), a.sinAngle = Math.sin(a.rotation))
				});
				if(q) {
					"FeatureCollection" === q.type && (this.mapTitle = q.title, q = a.geojson(q, this.type, this));
					this.mapData = q;
					this.mapMap = {};
					for(H = 0; H < q.length; H++) m = q[H], r = m.properties, m._i = H, t[0] && r && r[t[0]] && (m[t[0]] = r[t[0]]), y[m[t[0]]] = m;
					this.mapMap = y;
					b && t[1] && C(b, function(a) {
						y[a[t[1]]] && D.push(y[a[t[1]]])
					});
					h.allAreas ? (this.getBox(q),
						b = b || [], t[1] && C(b, function(a) {
							D.push(a[t[1]])
						}), D = "|" + d(D, function(a) {
							return a && a[t[0]]
						}).join("|") + "|", C(q, function(a) {
							t[0] && -1 !== D.indexOf("|" + a[t[0]] + "|") || (b.push(v(a, {
								value: null
							})), l = !1)
						})) : this.getBox(D)
				}
				g.prototype.setData.call(this, b, c, e, l)
			},
			drawGraph: t,
			drawDataLabels: t,
			doFullTranslate: function() {
				return this.isDirtyData || this.chart.isResizing || this.chart.renderer.isVML || !this.baseTrans
			},
			translate: function() {
				var a = this,
					c = a.xAxis,
					d = a.yAxis,
					e = a.doFullTranslate();
				a.generatePoints();
				C(a.data, function(b) {
					b.plotX =
						c.toPixels(b._midX, !0);
					b.plotY = d.toPixels(b._midY, !0);
					e && (b.shapeType = "path", b.shapeArgs = {
						d: a.translatePath(b.path)
					})
				});
				a.translateColors()
			},
			pointAttribs: function(a, c) {
				a = m.column.prototype.pointAttribs.call(this, a, c);
				e ? a["vector-effect"] = "non-scaling-stroke" : a["stroke-width"] = "inherit";
				return a
			},
			drawPoints: function() {
				var a = this,
					c = a.xAxis,
					d = a.yAxis,
					g = a.group,
					f = a.chart,
					k = f.renderer,
					l, n, r, q, t = this.baseTrans,
					v, x, y, p, u;
				a.transformGroup || (a.transformGroup = k.g().attr({
					scaleX: 1,
					scaleY: 1
				}).add(g), a.transformGroup.survive = !0);
				a.doFullTranslate() ? (f.hasRendered && C(a.points, function(b) {
					b.shapeArgs && (b.shapeArgs.fill = a.pointAttribs(b, b.state).fill)
				}), a.group = a.transformGroup, m.column.prototype.drawPoints.apply(a), a.group = g, C(a.points, function(a) {
					a.graphic && (a.name && a.graphic.addClass("highcharts-name-" + a.name.replace(/ /g, "-").toLowerCase()), a.properties && a.properties["hc-key"] && a.graphic.addClass("highcharts-key-" + a.properties["hc-key"].toLowerCase()))
				}), this.baseTrans = {
					originX: c.min - c.minPixelPadding / c.transA,
					originY: d.min -
						d.minPixelPadding / d.transA + (d.reversed ? 0 : d.len / d.transA),
					transAX: c.transA,
					transAY: d.transA
				}, this.transformGroup.animate({
					translateX: 0,
					translateY: 0,
					scaleX: 1,
					scaleY: 1
				})) : (l = c.transA / t.transAX, n = d.transA / t.transAY, r = c.toPixels(t.originX, !0), q = d.toPixels(t.originY, !0), .99 < l && 1.01 > l && .99 < n && 1.01 > n && (n = l = 1, r = Math.round(r), q = Math.round(q)), v = this.transformGroup, f.renderer.globalAnimation ? (x = v.attr("translateX"), y = v.attr("translateY"), p = v.attr("scaleX"), u = v.attr("scaleY"), v.attr({
					animator: 0
				}).animate({
					animator: 1
				}, {
					step: function(a, b) {
						v.attr({
							translateX: x + (r - x) * b.pos,
							translateY: y + (q - y) * b.pos,
							scaleX: p + (l - p) * b.pos,
							scaleY: u + (n - u) * b.pos
						})
					}
				})) : v.attr({
					translateX: r,
					translateY: q,
					scaleX: l,
					scaleY: n
				}));
				e || a.group.element.setAttribute("stroke-width", a.options[a.pointAttrToOptions && a.pointAttrToOptions["stroke-width"] || "borderWidth"] / (l || 1));
				this.drawMapDataLabels()
			},
			drawMapDataLabels: function() {
				g.prototype.drawDataLabels.call(this);
				this.dataLabelsGroup && this.dataLabelsGroup.clip(this.chart.clipRect)
			},
			render: function() {
				var a =
					this,
					c = g.prototype.render;
				a.chart.renderer.isVML && 3E3 < a.data.length ? setTimeout(function() {
					c.call(a)
				}) : c.call(a)
			},
			animate: function(a) {
				var b = this.options.animation,
					d = this.group,
					e = this.xAxis,
					g = this.yAxis,
					f = e.pos,
					k = g.pos;
				this.chart.renderer.isSVG && (!0 === b && (b = {
					duration: 1E3
				}), a ? d.attr({
					translateX: f + e.len / 2,
					translateY: k + g.len / 2,
					scaleX: .001,
					scaleY: .001
				}) : (d.animate({
					translateX: f,
					translateY: k,
					scaleX: 1,
					scaleY: 1
				}, b), this.animate = null))
			},
			animateDrilldown: function(a) {
				var b = this.chart.plotBox,
					d = this.chart.drilldownLevels[this.chart.drilldownLevels.length -
						1],
					e = d.bBox,
					g = this.chart.options.drilldown.animation;
				a || (a = Math.min(e.width / b.width, e.height / b.height), d.shapeArgs = {
					scaleX: a,
					scaleY: a,
					translateX: e.x,
					translateY: e.y
				}, C(this.points, function(a) {
					a.graphic && a.graphic.attr(d.shapeArgs).animate({
						scaleX: 1,
						scaleY: 1,
						translateX: 0,
						translateY: 0
					}, g)
				}), this.animate = null)
			},
			drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
			animateDrillupFrom: function(a) {
				m.column.prototype.animateDrillupFrom.call(this, a)
			},
			animateDrillupTo: function(a) {
				m.column.prototype.animateDrillupTo.call(this,
					a)
			}
		}), x({
			applyOptions: function(a, c) {
				a = l.prototype.applyOptions.call(this, a, c);
				c = this.series;
				var b = c.joinBy;
				c.mapData && ((b = void 0 !== a[b[1]] && c.mapMap[a[b[1]]]) ? (c.xyFromShape && (a.x = b._midX, a.y = b._midY), x(a, b)) : a.value = a.value || null);
				return a
			},
			onMouseOver: function(a) {
				clearTimeout(this.colorInterval);
				if(null !== this.value || this.series.options.nullInteraction) l.prototype.onMouseOver.call(this, a);
				else this.series.onMouseOut(a)
			},
			zoomTo: function() {
				var a = this.series;
				a.xAxis.setExtremes(this._minX, this._maxX, !1);
				a.yAxis.setExtremes(this._minY, this._maxY, !1);
				a.chart.redraw()
			}
		}, y))
	})(K);
	(function(a) {
		var y = a.seriesType,
			C = a.seriesTypes;
		y("mapline", "map", {
			lineWidth: 1,
			fillColor: "none"
		}, {
			type: "mapline",
			colorProp: "stroke",
			pointAttrToOptions: {
				stroke: "color",
				"stroke-width": "lineWidth"
			},
			pointAttribs: function(a, f) {
				a = C.map.prototype.pointAttribs.call(this, a, f);
				a.fill = this.options.fillColor;
				return a
			},
			drawLegendSymbol: C.line.prototype.drawLegendSymbol
		})
	})(K);
	(function(a) {
		var y = a.merge,
			C = a.Point;
		a = a.seriesType;
		a("mappoint",
			"scatter", {
				dataLabels: {
					enabled: !0,
					formatter: function() {
						return this.point.name
					},
					crop: !1,
					defer: !1,
					overflow: !1,
					style: {
						color: "#000000"
					}
				}
			}, {
				type: "mappoint",
				forceDL: !0
			}, {
				applyOptions: function(a, f) {
					a = void 0 !== a.lat && void 0 !== a.lon ? y(a, this.series.chart.fromLatLonToPoint(a)) : a;
					return C.prototype.applyOptions.call(this, a, f)
				}
			})
	})(K);
	(function(a) {
		var y = a.arrayMax,
			C = a.arrayMin,
			x = a.Axis,
			f = a.color,
			d = a.each,
			v = a.isNumber,
			t = a.noop,
			q = a.pick,
			n = a.pInt,
			l = a.Point,
			g = a.Series,
			r = a.seriesType,
			m = a.seriesTypes;
		r("bubble", "scatter", {
			dataLabels: {
				formatter: function() {
					return this.point.z
				},
				inside: !0,
				verticalAlign: "middle"
			},
			marker: {
				lineColor: null,
				lineWidth: 1,
				radius: null,
				states: {
					hover: {
						radiusPlus: 0
					}
				},
				symbol: "circle"
			},
			minSize: 8,
			maxSize: "20%",
			softThreshold: !1,
			states: {
				hover: {
					halo: {
						size: 5
					}
				}
			},
			tooltip: {
				pointFormat: "({point.x}, {point.y}), Size: {point.z}"
			},
			turboThreshold: 0,
			zThreshold: 0,
			zoneAxis: "z"
		}, {
			pointArrayMap: ["y", "z"],
			parallelArrays: ["x", "y", "z"],
			trackerGroups: ["group", "dataLabelsGroup"],
			specialGroup: "group",
			bubblePadding: !0,
			zoneAxis: "z",
			directTouch: !0,
			pointAttribs: function(a, d) {
				var b = q(this.options.marker.fillOpacity, .5);
				a = g.prototype.pointAttribs.call(this, a, d);
				1 !== b && (a.fill = f(a.fill).setOpacity(b).get("rgba"));
				return a
			},
			getRadii: function(a, d, b, c) {
				var e, g, f, k = this.zData,
					l = [],
					n = this.options,
					m = "width" !== n.sizeBy,
					r = n.zThreshold,
					q = d - a;
				g = 0;
				for(e = k.length; g < e; g++) f = k[g], n.sizeByAbsoluteValue && null !== f && (f = Math.abs(f - r), d = Math.max(d - r, Math.abs(a - r)), a = 0), null === f ? f = null : f < a ? f = b / 2 - 1 : (f = 0 < q ? (f - a) / q : .5, m && 0 <= f && (f = Math.sqrt(f)), f = Math.ceil(b +
					f * (c - b)) / 2), l.push(f);
				this.radii = l
			},
			animate: function(a) {
				var e = this.options.animation;
				a || (d(this.points, function(a) {
					var b = a.graphic,
						d;
					b && b.width && (d = {
						x: b.x,
						y: b.y,
						width: b.width,
						height: b.height
					}, b.attr({
						x: a.plotX,
						y: a.plotY,
						width: 1,
						height: 1
					}), b.animate(d, e))
				}), this.animate = null)
			},
			translate: function() {
				var d, e = this.data,
					b, c, g = this.radii;
				m.scatter.prototype.translate.call(this);
				for(d = e.length; d--;) b = e[d], c = g ? g[d] : 0, v(c) && c >= this.minPxSize / 2 ? (b.marker = a.extend(b.marker, {
					radius: c,
					width: 2 * c,
					height: 2 * c
				}), b.dlBox = {
					x: b.plotX - c,
					y: b.plotY - c,
					width: 2 * c,
					height: 2 * c
				}) : b.shapeArgs = b.plotY = b.dlBox = void 0
			},
			alignDataLabel: m.column.prototype.alignDataLabel,
			buildKDTree: t,
			applyZones: t
		}, {
			haloPath: function(a) {
				return l.prototype.haloPath.call(this, 0 === a ? 0 : (this.marker ? this.marker.radius || 0 : 0) + a)
			},
			ttBelow: !1
		});
		x.prototype.beforePadding = function() {
			var a = this,
				e = this.len,
				b = this.chart,
				c = 0,
				g = e,
				f = this.isXAxis,
				l = f ? "xData" : "yData",
				m = this.min,
				r = {},
				t = Math.min(b.plotWidth, b.plotHeight),
				x = Number.MAX_VALUE,
				K = -Number.MAX_VALUE,
				w = this.max -
				m,
				G = e / w,
				E = [];
			d(this.series, function(c) {
				var e = c.options;
				!c.bubblePadding || !c.visible && b.options.chart.ignoreHiddenSeries || (a.allowZoomOutside = !0, E.push(c), f && (d(["minSize", "maxSize"], function(a) {
					var b = e[a],
						c = /%$/.test(b),
						b = n(b);
					r[a] = c ? t * b / 100 : b
				}), c.minPxSize = r.minSize, c.maxPxSize = Math.max(r.maxSize, r.minSize), c = c.zData, c.length && (x = q(e.zMin, Math.min(x, Math.max(C(c), !1 === e.displayNegative ? e.zThreshold : -Number.MAX_VALUE))), K = q(e.zMax, Math.max(K, y(c))))))
			});
			d(E, function(b) {
				var d = b[l],
					e = d.length,
					h;
				f &&
					b.getRadii(x, K, b.minPxSize, b.maxPxSize);
				if(0 < w)
					for(; e--;) v(d[e]) && a.dataMin <= d[e] && d[e] <= a.dataMax && (h = b.radii[e], c = Math.min((d[e] - m) * G - h, c), g = Math.max((d[e] - m) * G + h, g))
			});
			E.length && 0 < w && !this.isLog && (g -= e, G *= (e + c - g) / e, d([
				["min", "userMin", c],
				["max", "userMax", g]
			], function(b) {
				void 0 === q(a.options[b[0]], a[b[1]]) && (a[b[0]] += b[2] / G)
			}))
		}
	})(K);
	(function(a) {
		var y = a.merge,
			C = a.Point,
			x = a.seriesType,
			f = a.seriesTypes;
		f.bubble && x("mapbubble", "bubble", {
			animationLimit: 500,
			tooltip: {
				pointFormat: "{point.name}: {point.z}"
			}
		}, {
			xyFromShape: !0,
			type: "mapbubble",
			pointArrayMap: ["z"],
			getMapData: f.map.prototype.getMapData,
			getBox: f.map.prototype.getBox,
			setData: f.map.prototype.setData
		}, {
			applyOptions: function(a, v) {
				return a && void 0 !== a.lat && void 0 !== a.lon ? C.prototype.applyOptions.call(this, y(a, this.series.chart.fromLatLonToPoint(a)), v) : f.map.prototype.pointClass.prototype.applyOptions.call(this, a, v)
			},
			isValid: function() {
				return "number" === typeof this.z
			},
			ttBelow: !1
		})
	})(K);
	(function(a) {
		var y = a.colorPointMixin,
			C = a.each,
			x = a.merge,
			f = a.noop,
			d = a.pick,
			v = a.Series,
			t = a.seriesType,
			q = a.seriesTypes;
		t("heatmap", "scatter", {
			animation: !1,
			borderWidth: 0,
			nullColor: "#f7f7f7",
			dataLabels: {
				formatter: function() {
					return this.point.value
				},
				inside: !0,
				verticalAlign: "middle",
				crop: !1,
				overflow: !1,
				padding: 0
			},
			marker: null,
			pointRange: null,
			tooltip: {
				pointFormat: "{point.x}, {point.y}: {point.value}\x3cbr/\x3e"
			},
			states: {
				normal: {
					animation: !0
				},
				hover: {
					halo: !1,
					brightness: .2
				}
			}
		}, x(a.colorSeriesMixin, {
			pointArrayMap: ["y", "value"],
			hasPointSpecificOptions: !0,
			getExtremesFromAll: !0,
			directTouch: !0,
			init: function() {
				var a;
				q.scatter.prototype.init.apply(this, arguments);
				a = this.options;
				a.pointRange = d(a.pointRange, a.colsize || 1);
				this.yAxis.axisPointRange = a.rowsize || 1
			},
			translate: function() {
				var a = this.options,
					f = this.xAxis,
					g = this.yAxis,
					r = a.pointPadding || 0,
					m = function(a, d, b) {
						return Math.min(Math.max(d, a), b)
					};
				this.generatePoints();
				C(this.points, function(k) {
					var e = (a.colsize || 1) / 2,
						b = (a.rowsize || 1) / 2,
						c = m(Math.round(f.len - f.translate(k.x - e, 0, 1, 0, 1)), -f.len, 2 * f.len),
						e = m(Math.round(f.len - f.translate(k.x +
							e, 0, 1, 0, 1)), -f.len, 2 * f.len),
						h = m(Math.round(g.translate(k.y - b, 0, 1, 0, 1)), -g.len, 2 * g.len),
						b = m(Math.round(g.translate(k.y + b, 0, 1, 0, 1)), -g.len, 2 * g.len),
						l = d(k.pointPadding, r);
					k.plotX = k.clientX = (c + e) / 2;
					k.plotY = (h + b) / 2;
					k.shapeType = "rect";
					k.shapeArgs = {
						x: Math.min(c, e) + l,
						y: Math.min(h, b) + l,
						width: Math.abs(e - c) - 2 * l,
						height: Math.abs(b - h) - 2 * l
					}
				});
				this.translateColors()
			},
			drawPoints: function() {
				q.column.prototype.drawPoints.call(this);
				C(this.points, function(a) {
					a.graphic.attr(this.colorAttribs(a))
				}, this)
			},
			animate: f,
			getBox: f,
			drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
			alignDataLabel: q.column.prototype.alignDataLabel,
			getExtremes: function() {
				v.prototype.getExtremes.call(this, this.valueData);
				this.valueMin = this.dataMin;
				this.valueMax = this.dataMax;
				v.prototype.getExtremes.call(this)
			}
		}), a.extend({
			haloPath: function(a) {
				if(!a) return [];
				var d = this.shapeArgs;
				return ["M", d.x - a, d.y - a, "L", d.x - a, d.y + d.height + a, d.x + d.width + a, d.y + d.height + a, d.x + d.width + a, d.y - a, "Z"]
			}
		}, y))
	})(K);
	(function(a) {
		function y(a, d) {
			var g, f, l, k = !1,
				e = a.x,
				b = a.y;
			a = 0;
			for(g = d.length - 1; a < d.length; g = a++) f = d[a][1] > b, l = d[g][1] > b, f !== l && e < (d[g][0] - d[a][0]) * (b - d[a][1]) / (d[g][1] - d[a][1]) + d[a][0] && (k = !k);
			return k
		}
		var C = a.Chart,
			x = a.each,
			f = a.extend,
			d = a.format,
			v = a.merge,
			t = a.win,
			q = a.wrap;
		C.prototype.transformFromLatLon = function(d, f) {
			if(void 0 === t.proj4) return a.error(21), {
				x: 0,
				y: null
			};
			d = t.proj4(f.crs, [d.lon, d.lat]);
			var g = f.cosAngle || f.rotation && Math.cos(f.rotation),
				l = f.sinAngle || f.rotation && Math.sin(f.rotation);
			d = f.rotation ? [d[0] * g + d[1] * l, -d[0] * l + d[1] * g] : d;
			return {
				x: ((d[0] -
					(f.xoffset || 0)) * (f.scale || 1) + (f.xpan || 0)) * (f.jsonres || 1) + (f.jsonmarginX || 0),
				y: (((f.yoffset || 0) - d[1]) * (f.scale || 1) + (f.ypan || 0)) * (f.jsonres || 1) - (f.jsonmarginY || 0)
			}
		};
		C.prototype.transformToLatLon = function(d, f) {
			if(void 0 === t.proj4) a.error(21);
			else {
				d = {
					x: ((d.x - (f.jsonmarginX || 0)) / (f.jsonres || 1) - (f.xpan || 0)) / (f.scale || 1) + (f.xoffset || 0),
					y: ((-d.y - (f.jsonmarginY || 0)) / (f.jsonres || 1) + (f.ypan || 0)) / (f.scale || 1) + (f.yoffset || 0)
				};
				var g = f.cosAngle || f.rotation && Math.cos(f.rotation),
					l = f.sinAngle || f.rotation && Math.sin(f.rotation);
				f = t.proj4(f.crs, "WGS84", f.rotation ? {
					x: d.x * g + d.y * -l,
					y: d.x * l + d.y * g
				} : d);
				return {
					lat: f.y,
					lon: f.x
				}
			}
		};
		C.prototype.fromPointToLatLon = function(d) {
			var f = this.mapTransforms,
				g;
			if(f) {
				for(g in f)
					if(f.hasOwnProperty(g) && f[g].hitZone && y({
							x: d.x,
							y: -d.y
						}, f[g].hitZone.coordinates[0])) return this.transformToLatLon(d, f[g]);
				return this.transformToLatLon(d, f["default"])
			}
			a.error(22)
		};
		C.prototype.fromLatLonToPoint = function(d) {
			var f = this.mapTransforms,
				g, n;
			if(!f) return a.error(22), {
				x: 0,
				y: null
			};
			for(g in f)
				if(f.hasOwnProperty(g) &&
					f[g].hitZone && (n = this.transformFromLatLon(d, f[g]), y({
						x: n.x,
						y: -n.y
					}, f[g].hitZone.coordinates[0]))) return n;
			return this.transformFromLatLon(d, f["default"])
		};
		a.geojson = function(a, l, g) {
			var n = [],
				m = [],
				k = function(a) {
					var b, c = a.length;
					m.push("M");
					for(b = 0; b < c; b++) 1 === b && m.push("L"), m.push(a[b][0], -a[b][1])
				};
			l = l || "map";
			x(a.features, function(a) {
				var b = a.geometry,
					c = b.type,
					b = b.coordinates;
				a = a.properties;
				var d;
				m = [];
				"map" === l || "mapbubble" === l ? ("Polygon" === c ? (x(b, k), m.push("Z")) : "MultiPolygon" === c && (x(b, function(a) {
					x(a,
						k)
				}), m.push("Z")), m.length && (d = {
					path: m
				})) : "mapline" === l ? ("LineString" === c ? k(b) : "MultiLineString" === c && x(b, k), m.length && (d = {
					path: m
				})) : "mappoint" === l && "Point" === c && (d = {
					x: b[0],
					y: -b[1]
				});
				d && n.push(f(d, {
					name: a.name || a.NAME,
					properties: a
				}))
			});
			g && a.copyrightShort && (g.chart.mapCredits = d(g.chart.options.credits.mapText, {
				geojson: a
			}), g.chart.mapCreditsFull = d(g.chart.options.credits.mapTextFull, {
				geojson: a
			}));
			return n
		};
		q(C.prototype, "addCredits", function(a, d) {
			d = v(!0, this.options.credits, d);
			this.mapCredits && (d.href =
				null);
			a.call(this, d);
			this.credits && this.mapCreditsFull && this.credits.attr({
				title: this.mapCreditsFull
			})
		})
	})(K);
	(function(a) {
		function y(a, d, f, k, e, b, c, h) {
			return ["M", a + e, d, "L", a + f - b, d, "C", a + f - b / 2, d, a + f, d + b / 2, a + f, d + b, "L", a + f, d + k - c, "C", a + f, d + k - c / 2, a + f - c / 2, d + k, a + f - c, d + k, "L", a + h, d + k, "C", a + h / 2, d + k, a, d + k - h / 2, a, d + k - h, "L", a, d + e, "C", a, d + e / 2, a + e / 2, d, a + e, d, "Z"]
		}
		var C = a.Chart,
			x = a.defaultOptions,
			f = a.each,
			d = a.extend,
			v = a.merge,
			t = a.pick,
			q = a.Renderer,
			n = a.SVGRenderer,
			l = a.VMLRenderer;
		d(x.lang, {
			zoomIn: "Zoom in",
			zoomOut: "Zoom out"
		});
		x.mapNavigation = {
			buttonOptions: {
				alignTo: "plotBox",
				align: "left",
				verticalAlign: "top",
				x: 0,
				width: 18,
				height: 18,
				padding: 5,
				style: {
					fontSize: "15px",
					fontWeight: "bold"
				},
				theme: {
					"stroke-width": 1,
					"text-align": "center"
				}
			},
			buttons: {
				zoomIn: {
					onclick: function() {
						this.mapZoom(.5)
					},
					text: "+",
					y: 0
				},
				zoomOut: {
					onclick: function() {
						this.mapZoom(2)
					},
					text: "-",
					y: 28
				}
			},
			mouseWheelSensitivity: 1.1
		};
		a.splitPath = function(a) {
			var d;
			a = a.replace(/([A-Za-z])/g, " $1 ");
			a = a.replace(/^\s*/, "").replace(/\s*$/, "");
			a = a.split(/[ ,]+/);
			for(d = 0; d < a.length; d++) /[a-zA-Z]/.test(a[d]) ||
				(a[d] = parseFloat(a[d]));
			return a
		};
		a.maps = {};
		n.prototype.symbols.topbutton = function(a, d, f, k, e) {
			return y(a - 1, d - 1, f, k, e.r, e.r, 0, 0)
		};
		n.prototype.symbols.bottombutton = function(a, d, f, k, e) {
			return y(a - 1, d - 1, f, k, 0, 0, e.r, e.r)
		};
		q === l && f(["topbutton", "bottombutton"], function(a) {
			l.prototype.symbols[a] = n.prototype.symbols[a]
		});
		a.Map = a.mapChart = function(d, f, l) {
			var g = "string" === typeof d || d.nodeName,
				e = arguments[g ? 1 : 0],
				b = {
					endOnTick: !1,
					visible: !1,
					minPadding: 0,
					maxPadding: 0,
					startOnTick: !1
				},
				c, h = a.getOptions().credits;
			c = e.series;
			e.series = null;
			e = v({
				chart: {
					panning: "xy",
					type: "map"
				},
				credits: {
					mapText: t(h.mapText, ' \u00a9 \x3ca href\x3d"{geojson.copyrightUrl}"\x3e{geojson.copyrightShort}\x3c/a\x3e'),
					mapTextFull: t(h.mapTextFull, "{geojson.copyright}")
				},
				tooltip: {
					followTouchMove: !1
				},
				xAxis: b,
				yAxis: v(b, {
					reversed: !0
				})
			}, e, {
				chart: {
					inverted: !1,
					alignTicks: !1
				}
			});
			e.series = c;
			return g ? new C(d, e, l) : new C(e, f)
		}
	})(K);
	return K
});