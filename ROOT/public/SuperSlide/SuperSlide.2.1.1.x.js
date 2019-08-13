!
function(e) {
    e.fn.slide = function(t) {
        return e.fn.slide.defaults = {
            type: "slide",
            effect: "fade",
            autoPlay: !1,
            delayTime: 500,
            interTime: 4e3,
            triggerTime: 150,
            defaultIndex: 0,
            titCell: ".hd li",
            mainCell: ".bd",
            targetCell: null,
            trigger: "mouseover",
            scroll: 1,
            vis: 1,
            titOnClassName: "on",
            autoPage: !1,
            prevCell: ".prev",
            nextCell: ".next",
            pageStateCell: ".pageState",
            opp: !1,
            pnLoop: !0,
            easing: "swing",
            startFun: null,
            endFun: null,
            switchLoad: null,
            switchLoadTag: "img",
            playStateCell: ".playState",
            mouseOverStop: !0,
            defaultPlay: !0,
            returnDefault: !1
        },
		
        this.each(function() {
            var a = e.extend({},
            e.fn.slide.defaults, t),
            n = e(this);
            n.data("options", a);
            var i = a.effect,
            s = e(a.prevCell, n),
            r = e(a.nextCell, n),
            o = e(a.pageStateCell, n),
            l = e(a.playStateCell, n),
            u = e(a.titCell, n),
            c = u.size(),
            f = e(a.mainCell, n),
            d = f.children().size(),
            p = a.switchLoad,
            h = e(a.targetCell, n),
            v = parseInt(a.defaultIndex),
            m = parseInt(a.delayTime),
            g = parseInt(a.interTime),
            w = (parseInt(a.triggerTime), parseInt(a.scroll)),
            I = parseInt(a.vis),
            M = "false" == a.autoPlay || 0 == a.autoPlay ? !1 : !0,
            C = "false" == a.opp || 0 == a.opp ? !1 : !0,
            y = "false" == a.autoPage || 0 == a.autoPage ? !1 : !0,
            b = "false" == a.pnLoop || 0 == a.pnLoop ? !1 : !0,
            x = "false" == a.mouseOverStop || 0 == a.mouseOverStop ? !1 : !0,
            O = "false" == a.defaultPlay || 0 == a.defaultPlay ? !1 : !0,
            W = "false" == a.returnDefault || 0 == a.returnDefault ? !1 : !0;
            a.slideH = 0,
            a.slideW = 0,
            a.selfW = 0,
            a.selfH = 0;
            var q, k = a.easing,
            H = null,
            P = null,
            T = null,
            Q = a.titOnClassName,
            S = u.index(n.find("." + Q)),
            L = v = -1 == S ? v: S,
            j = v,
            B = v,
            D = d >= I ? d % w != 0 ? d % w: w: 0,
            F = "leftMarquee" == i || "topMarquee" == i ? !0 : !1,
			
            E = function() {
                e.isFunction(a.startFun) && a.startFun(v, c, n, e(a.titCell, n), f, h, s, r)
            },
			
            A = function() {
                e.isFunction(a.endFun) && a.endFun(v, c, n, e(a.titCell, n), f, h, s, r)
            },
			
            z = function() {
                u.removeClass(Q),
                O && u.eq(j).addClass(Q)
            };
			
            if ("menu" == a.type) return O && u.removeClass(Q).eq(v).addClass(Q),
			
            u.hover(function() {
                q = e(this).find(a.targetCell);
                var t = u.index(e(this));
                P = setTimeout(function() {
                    switch (v = t, u.removeClass(Q).eq(v).addClass(Q), E(), i) {
                    case "fade":
                        q.stop(!0, !0).animate({
                            opacity: "show"
                        },
                        m, k, A);
                        break;
                    case "slideDown":
                        q.stop(!0, !0).animate({
                            height: "show"
                        },
                        m, k, A)
                    }
                },
                a.triggerTime)
            },
			
            function() {
                switch (clearTimeout(P), i) {
                case "fade":
                    q.animate({
                        opacity:
                        "hide"
                    },
                    m, k);
                    break;
                case "slideDown":
                    q.animate({
                        height:
                        "hide"
                    },
                    m, k)
                }
            }),
            void(W && n.hover(function() {
                clearTimeout(T)
            },
			
            function() {
                T = setTimeout(z, m)
            }));
            if (0 == c && (c = d), F && (c = 2), y) {
                if (d >= I) if ("leftLoop" == i || "topLoop" == i) c = d % w != 0 ? (d / w ^ 0) + 1 : d / w;
                else {
                    var N = d - I;
                    c = 1 + parseInt(N % w != 0 ? N / w + 1 : N / w),
                    0 >= c && (c = 1)
                } else c = 1;
                u.html("");
                var U = "";
                if (1 == a.autoPage || "true" == a.autoPage) for (var $ = 0; c > $; $++) U += "<li>" + ($ + 1) + "</li>";
                else for (var $ = 0; c > $; $++) U += a.autoPage.replace("$", $ + 1);
                u.html(U);
                var u = u.children()
            }
            if (d >= I) {
                f.children().each(function() {
                    e(this).width() > a.selfW && (a.selfW = e(this).width(), a.slideW = e(this).outerWidth(!0)),
                    e(this).height() > a.selfH && (a.selfH = e(this).height(), a.slideH = e(this).outerHeight(!0))
                });
                var G = f.children(),
                J = function() {
                    for (var e = 0; I > e; e++) G.eq(e).clone().addClass("clone").appendTo(f);
                    for (var e = 0; D > e; e++) G.eq(d - e - 1).clone().addClass("clone").prependTo(f)
                };
                switch (i) {
                case "fold":
                    f.css({
                        position:
                        "relative",
                        //width: a.slideW,
						width: "100%",
                        height: a.slideH
                    }).children().css({
                        position: "absolute",
                       // width: a.selfW,
					    width: "100%",
                        left: 0,
                        top: 0,
                        display: "none"
                    });
                    break;
                case "top":
                    f.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:' + I * a.slideH + 'px"></div>').css({
                        top: -(v * w) * a.slideH,
                        position: "relative",
                        padding: "0",
                        margin: "0"
                    }).children().css({
                        height: a.selfH
                    });
                    break;
                case "left":
                    f.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:' + I * a.slideW + 'px"></div>').css({
                        width: d * a.slideW,
                        left: -(v * w) * a.slideW,
                        position: "relative",
                        overflow: "hidden",
                        padding: "0",
                        margin: "0"
                    }).children().css({
                        "float": "left",
                        width: a.selfW
                    });
                    break;
                case "leftLoop":
                case "leftMarquee":
                    J(),
                    f.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:' + I * a.slideW + 'px"></div>').css({
                        width: (d + I + D) * a.slideW,
                        position: "relative",
                        overflow: "hidden",
                        padding: "0",
                        margin: "0",
                        left: -(D + v * w) * a.slideW
                    }).children().css({
                        "float": "left",
                        width: a.selfW
                    });
                    break;
                case "topLoop":
                case "topMarquee":
                    J(),
                    f.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:' + I * a.slideH + 'px"></div>').css({
                        height: (d + I + D) * a.slideH,
                        position: "relative",
                        padding: "0",
                        margin: "0",
                        top: -(D + v * w) * a.slideH
                    }).children().css({
                        height: a.selfH
                    })
                }
            }
			
            var K = function(e) {
                var t = e * w;
                return e == c ? t = d: -1 == e && d % w != 0 && (t = -d % w),
                t
            },
			
            R = function(t) {
                var n = function(n) {
                    for (var i = a.switchLoadTag,
                    s = n; I + n > s; s++) t.eq(s).find(i + "[" + p + "]").each(function() {
                        var t = e(this);
                        if ("img" == i ? t.attr("src", t.attr(p)).removeAttr(p) : t.css("background-image", "url('" + t.attr(p) + "')").removeAttr(p), f.find(".clone")[0]) for (var a = f.children(), n = 0; n < a.size(); n++) a.eq(n).find(i + "[" + p + "]").each(function() {
                            e(this).attr(p) == t.attr("src") && ("img" == i ? e(this).attr("src", e(this).attr(p)).removeAttr(p) : e(this).css("background-image", "url('" + e(this).attr(p) + "')").removeAttr(p))
                        })
                    })
                };
                switch (i) {
                case "fade":
                case "fold":
                case "top":
                case "left":
                case "slideDown":
                    n(v * w);
                    break;
                case "leftLoop":
                case "topLoop":
                    n(D + K(B));
                    break;
                case "leftMarquee":
                case "topMarquee":
                    var s = "leftMarquee" == i ? f.css("left").replace("px", "") : f.css("top").replace("px", ""),
                    r = "leftMarquee" == i ? a.slideW: a.slideH,
                    o = D;
                    if (s % r != 0) {
                        var l = Math.abs(s / r ^ 0);
                        o = 1 == v ? D + l: D + l - 1
                    }
                    n(o)
                }
            },
			
            V = function(e) {
                if (!O || L != v || e || F) {
                    if (F ? v >= 1 ? v = 1 : 0 >= v && (v = 0) : (B = v, v >= c ? v = 0 : 0 > v && (v = c - 1)), E(), null != p && R(f.children()), h[0] && (q = h.eq(v), null != p && R(h), "slideDown" == i ? (h.not(q).stop(!0, !0).slideUp(m), q.slideDown(m, k,
                    function() {
                        f[0] || A()
                    })) : (h.not(q).stop(!0, !0).hide(), q.animate({
                        opacity: "show"
                    },
                    m,
                    function() {
                        f[0] || A()
                    }))), d >= I) switch (i) {
                    case "fade":
                        f.children().stop(!0, !0).eq(v).animate({
                            opacity: "show"
                        },
                        m, k,
                        function() {
                            A()
                        }).siblings().hide();
                        break;
                    case "fold":
                        f.children().stop(!0, !0).eq(v).animate({
                            opacity: "show"
                        },
                        m, k,
                        function() {
                            A()
                        }).siblings().animate({
                            opacity: "hide"
                        },
                        m, k);
                        break;
                    case "top":
                        f.stop(!0, !1).animate({
                            top: -v * w * a.slideH
                        },
                        m, k,
                        function() {
                            A()
                        });
                        break;
                    case "left":
                        f.stop(!0, !1).animate({
                            left: -v * w * a.slideW
                        },
                        m, k,
                        function() {
                            A()
                        });
                        break;
                    case "leftLoop":
                        var t = B;
                        f.stop(!0, !0).animate({
                            left: -(K(B) + D) * a.slideW
                        },
                        m, k,
                        function() { - 1 >= t ? f.css("left", -(D + (c - 1) * w) * a.slideW) : t >= c && f.css("left", -D * a.slideW),
                            A()
                        });
                        break;
                    case "topLoop":
                        var t = B;
                        f.stop(!0, !0).animate({
                            top: -(K(B) + D) * a.slideH
                        },
                        m, k,
                        function() { - 1 >= t ? f.css("top", -(D + (c - 1) * w) * a.slideH) : t >= c && f.css("top", -D * a.slideH),
                            A()
                        });
                        break;
                    case "leftMarquee":
                        var n = f.css("left").replace("px", "");
                        0 == v ? f.animate({
                            left: ++n
                        },
                        0,
                        function() {
                            f.css("left").replace("px", "") >= 0 && f.css("left", -d * a.slideW)
                        }) : f.animate({
                            left: --n
                        },
                        0,
                        function() {
                            f.css("left").replace("px", "") <= -(d + D) * a.slideW && f.css("left", -D * a.slideW)
                        });
                        break;
                    case "topMarquee":
                        var l = f.css("top").replace("px", "");
                        0 == v ? f.animate({
                            top: ++l
                        },
                        0,
                        function() {
                            f.css("top").replace("px", "") >= 0 && f.css("top", -d * a.slideH)
                        }) : f.animate({
                            top: --l
                        },
                        0,
                        function() {
                            f.css("top").replace("px", "") <= -(d + D) * a.slideH && f.css("top", -D * a.slideH)
                        })
                    }
                    u.removeClass(Q).eq(v).addClass(Q),
                    L = v,
                    b || (r.removeClass("nextStop"), s.removeClass("prevStop"), 0 == v && s.addClass("prevStop"), v == c - 1 && r.addClass("nextStop")),
                    o.html("<span>" + (v + 1) + "</span>/" + c)
                }
            };
            O && V(!0),
            W && n.hover(function() {
                clearTimeout(T)
            },
			
            function() {
                T = setTimeout(function() {
                    v = j,
                    O ? V() : "slideDown" == i ? q.slideUp(m, z) : q.animate({
                        opacity: "hide"
                    },
                    m, z),
                    L = v
                },
                300)
            });
			
            var X = function(e) {
                H = setInterval(function() {
                    C ? v--:v++,
                    V()
                },
                e ? e: g)
            },
			
            Y = function(e) {
                H = setInterval(V, e ? e: g)
            },
			
            Z = function() {
                x || (clearInterval(H), X())
            },
			
            _ = function() { (b || v != c - 1) && (v++, V(), F || Z())
            },
			
            et = function() { (b || 0 != v) && (v--, V(), F || Z())
            },
			
            tt = function() {
                clearInterval(H),
                F ? Y() : X(),
                l.removeClass("pauseState")
            },
			
            at = function() {
                clearInterval(H),
                l.addClass("pauseState")
            };
            if (M ? F ? (C ? v--:v++, Y(), x && f.hover(at, tt)) : (X(), x && n.hover(at, tt)) : (F && (C ? v--:v++), l.addClass("pauseState")), l.click(function() {
                l.hasClass("pauseState") ? tt() : at()
            }), "mouseover" == a.trigger ? u.hover(function() {
                var e = u.index(this);
                P = setTimeout(function() {
                    v = e,
                    V(),
                    Z()
                },
                a.triggerTime)
            },
			
            function() {
                clearTimeout(P)
            }) : u.click(function() {
                v = u.index(this),
                V(),
                Z()
            }), F) {
                if (r.mousedown(_), s.mousedown(et), b) {
                    var nt, it = function() {
                        nt = setTimeout(function() {
                            clearInterval(H),
                            Y(g / 10 ^ 0)
                        },
                        150)
                    },
                    st = function() {
                        clearTimeout(nt),
                        clearInterval(H),
                        Y()
                    };
                    r.mousedown(it),
                    r.mouseup(st),
                    s.mousedown(it),
                    s.mouseup(st)
                }
                "mouseover" == a.trigger && (r.hover(_,
                function() {}), s.hover(et,
                function() {}))
            } else r.click(_),
            s.click(et)
        })
    }
} (jQuery),

jQuery.easing.jswing = jQuery.easing.swing,
jQuery.extend(jQuery.easing, {
    def: "easeOutQuad",
    swing: function(e, t, a, n, i) {
        return jQuery.easing[jQuery.easing.def](e, t, a, n, i)
    },
    easeInQuad: function(e, t, a, n, i) {
        return n * (t /= i) * t + a
    },
    easeOutQuad: function(e, t, a, n, i) {
        return - n * (t /= i) * (t - 2) + a
    },
    easeInOutQuad: function(e, t, a, n, i) {
        return (t /= i / 2) < 1 ? n / 2 * t * t + a: -n / 2 * (--t * (t - 2) - 1) + a
    },
    easeInCubic: function(e, t, a, n, i) {
        return n * (t /= i) * t * t + a
    },
    easeOutCubic: function(e, t, a, n, i) {
        return n * ((t = t / i - 1) * t * t + 1) + a
    },
    easeInOutCubic: function(e, t, a, n, i) {
        return (t /= i / 2) < 1 ? n / 2 * t * t * t + a: n / 2 * ((t -= 2) * t * t + 2) + a
    },
    easeInQuart: function(e, t, a, n, i) {
        return n * (t /= i) * t * t * t + a
    },
    easeOutQuart: function(e, t, a, n, i) {
        return - n * ((t = t / i - 1) * t * t * t - 1) + a
    },
    easeInOutQuart: function(e, t, a, n, i) {
        return (t /= i / 2) < 1 ? n / 2 * t * t * t * t + a: -n / 2 * ((t -= 2) * t * t * t - 2) + a
    },
    easeInQuint: function(e, t, a, n, i) {
        return n * (t /= i) * t * t * t * t + a
    },
    easeOutQuint: function(e, t, a, n, i) {
        return n * ((t = t / i - 1) * t * t * t * t + 1) + a
    },
    easeInOutQuint: function(e, t, a, n, i) {
        return (t /= i / 2) < 1 ? n / 2 * t * t * t * t * t + a: n / 2 * ((t -= 2) * t * t * t * t + 2) + a
    },
    easeInSine: function(e, t, a, n, i) {
        return - n * Math.cos(t / i * (Math.PI / 2)) + n + a
    },
    easeOutSine: function(e, t, a, n, i) {
        return n * Math.sin(t / i * (Math.PI / 2)) + a
    },
    easeInOutSine: function(e, t, a, n, i) {
        return - n / 2 * (Math.cos(Math.PI * t / i) - 1) + a
    },
    easeInExpo: function(e, t, a, n, i) {
        return 0 == t ? a: n * Math.pow(2, 10 * (t / i - 1)) + a
    },
    easeOutExpo: function(e, t, a, n, i) {
        return t == i ? a + n: n * ( - Math.pow(2, -10 * t / i) + 1) + a
    },
    easeInOutExpo: function(e, t, a, n, i) {
        return 0 == t ? a: t == i ? a + n: (t /= i / 2) < 1 ? n / 2 * Math.pow(2, 10 * (t - 1)) + a: n / 2 * ( - Math.pow(2, -10 * --t) + 2) + a
    },
    easeInCirc: function(e, t, a, n, i) {
        return - n * (Math.sqrt(1 - (t /= i) * t) - 1) + a
    },
    easeOutCirc: function(e, t, a, n, i) {
        return n * Math.sqrt(1 - (t = t / i - 1) * t) + a
    },
    easeInOutCirc: function(e, t, a, n, i) {
        return (t /= i / 2) < 1 ? -n / 2 * (Math.sqrt(1 - t * t) - 1) + a: n / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + a
    },
    easeInElastic: function(e, t, a, n, i) {
        var s = 1.70158,
        r = 0,
        o = n;
        if (0 == t) return a;
        if (1 == (t /= i)) return a + n;
        if (r || (r = .3 * i), o < Math.abs(n)) {
            o = n;
            var s = r / 4
        } else var s = r / (2 * Math.PI) * Math.asin(n / o);
        return - (o * Math.pow(2, 10 * (t -= 1)) * Math.sin(2 * (t * i - s) * Math.PI / r)) + a
    },
    easeOutElastic: function(e, t, a, n, i) {
        var s = 1.70158,
        r = 0,
        o = n;
        if (0 == t) return a;
        if (1 == (t /= i)) return a + n;
        if (r || (r = .3 * i), o < Math.abs(n)) {
            o = n;
            var s = r / 4
        } else var s = r / (2 * Math.PI) * Math.asin(n / o);
        return o * Math.pow(2, -10 * t) * Math.sin(2 * (t * i - s) * Math.PI / r) + n + a
    },
    easeInOutElastic: function(e, t, a, n, i) {
        var s = 1.70158,
        r = 0,
        o = n;
        if (0 == t) return a;
        if (2 == (t /= i / 2)) return a + n;
        if (r || (r = .3 * i * 1.5), o < Math.abs(n)) {
            o = n;
            var s = r / 4
        } else var s = r / (2 * Math.PI) * Math.asin(n / o);
        return 1 > t ? -.5 * o * Math.pow(2, 10 * (t -= 1)) * Math.sin(2 * (t * i - s) * Math.PI / r) + a: o * Math.pow(2, -10 * (t -= 1)) * Math.sin(2 * (t * i - s) * Math.PI / r) * .5 + n + a
    },
    easeInBack: function(e, t, a, n, i, s) {
        return void 0 == s && (s = 1.70158),
        n * (t /= i) * t * ((s + 1) * t - s) + a
    },
    easeOutBack: function(e, t, a, n, i, s) {
        return void 0 == s && (s = 1.70158),
        n * ((t = t / i - 1) * t * ((s + 1) * t + s) + 1) + a
    },
    easeInOutBack: function(e, t, a, n, i, s) {
        return void 0 == s && (s = 1.70158),
        (t /= i / 2) < 1 ? n / 2 * t * t * (((s *= 1.525) + 1) * t - s) + a: n / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + a
    },
    easeInBounce: function(e, t, a, n, i) {
        return n - jQuery.easing.easeOutBounce(e, i - t, 0, n, i) + a
    },
    easeOutBounce: function(e, t, a, n, i) {
        return (t /= i) < 1 / 2.75 ? 7.5625 * n * t * t + a: 2 / 2.75 > t ? n * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + a: 2.5 / 2.75 > t ? n * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + a: n * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + a
    },
    easeInOutBounce: function(e, t, a, n, i) {
        return i / 2 > t ? .5 * jQuery.easing.easeInBounce(e, 2 * t, 0, n, i) + a: .5 * jQuery.easing.easeOutBounce(e, 2 * t - i, 0, n, i) + .5 * n + a
    }
});