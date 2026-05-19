import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/real-estate/RealEstateApp.jsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=4504e681"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
let prevRefreshReg;
let prevRefreshSig;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import __vite__cjsImport3_react from "/node_modules/.vite/deps/react.js?v=4504e681"; const React = __vite__cjsImport3_react.__esModule ? __vite__cjsImport3_react.default : __vite__cjsImport3_react; const useEffect = __vite__cjsImport3_react["useEffect"];
import { Navigate, Route, Routes } from "/node_modules/.vite/deps/react-router-dom.js?v=4504e681";
import "/src/real-estate/re.css";
import RealEstateLayout from "/src/real-estate/layouts/RealEstateLayout.jsx";
import DashboardLayout from "/src/real-estate/layouts/DashboardLayout.jsx";
import ProtectedRoute from "/src/real-estate/components/routing/ProtectedRoute.jsx";
import { ROUTES } from "/src/real-estate/config/navigation.js";
import Home from "/src/real-estate/pages/HomePage.jsx";
import Listing from "/src/real-estate/pages/Listing.jsx";
import PropertyDetail from "/src/real-estate/pages/PropertyDetail.jsx";
import SignIn from "/src/real-estate/pages/auth/SignIn.jsx";
import SignUp from "/src/real-estate/pages/auth/SignUp.jsx";
import Dashboard from "/src/real-estate/pages/Dashboard.jsx";
import PostProperty from "/src/real-estate/pages/PostProperty.jsx";
import EditProperty from "/src/real-estate/pages/EditProperty.jsx";
import Saved from "/src/real-estate/pages/Saved.jsx";
import Compare from "/src/real-estate/pages/Compare.jsx";
import WorkspaceDashboard from "/src/real-estate/pages/Workspace/WorkspaceDashboard.jsx";
import WorkspaceProperties from "/src/real-estate/pages/Workspace/WorkspaceProperties.jsx";
import AdminIndex from "/src/real-estate/pages/Admin/Index.jsx";
const protectedShell = (page, route, layoutProps = {}) => /* @__PURE__ */ jsxDEV(ProtectedRoute, { route, children: /* @__PURE__ */ jsxDEV(DashboardLayout, { ...layoutProps, children: page }, void 0, false, {
  fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
  lineNumber: 45,
  columnNumber: 5
}, this) }, void 0, false, {
  fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
  lineNumber: 44,
  columnNumber: 1
}, this);
export default function RealEstateApp() {
  _s();
  useEffect(() => {
    document.title = "Doltec Properties | Premium Real Estate Marketplace India";
  }, []);
  return /* @__PURE__ */ jsxDEV("div", { className: "re-root-override", style: { minHeight: "100vh", color: "#0f172a" }, children: /* @__PURE__ */ jsxDEV(Routes, { children: [
    /* @__PURE__ */ jsxDEV(Route, { path: "/", element: /* @__PURE__ */ jsxDEV(RealEstateLayout, {}, void 0, false, {
      fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
      lineNumber: 57,
      columnNumber: 34
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Route, { index: true, element: /* @__PURE__ */ jsxDEV(Home, {}, void 0, false, {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 58,
        columnNumber: 33
      }, this) }, void 0, false, {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 58,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "listing", element: /* @__PURE__ */ jsxDEV(Listing, {}, void 0, false, {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 59,
        columnNumber: 42
      }, this) }, void 0, false, {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 59,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "properties", element: /* @__PURE__ */ jsxDEV(Listing, {}, void 0, false, {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 60,
        columnNumber: 45
      }, this) }, void 0, false, {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 60,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "property/:slug", element: /* @__PURE__ */ jsxDEV(PropertyDetail, {}, void 0, false, {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 61,
        columnNumber: 49
      }, this) }, void 0, false, {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 61,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "properties/:slug", element: /* @__PURE__ */ jsxDEV(PropertyDetail, {}, void 0, false, {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 62,
        columnNumber: 51
      }, this) }, void 0, false, {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 62,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "compare", element: /* @__PURE__ */ jsxDEV(Compare, {}, void 0, false, {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 63,
        columnNumber: 42
      }, this) }, void 0, false, {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 63,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "auth/login", element: /* @__PURE__ */ jsxDEV(SignIn, {}, void 0, false, {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 64,
        columnNumber: 45
      }, this) }, void 0, false, {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 64,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "auth/signup", element: /* @__PURE__ */ jsxDEV(SignUp, {}, void 0, false, {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 65,
        columnNumber: 46
      }, this) }, void 0, false, {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 65,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "login", element: /* @__PURE__ */ jsxDEV(SignIn, {}, void 0, false, {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 66,
        columnNumber: 40
      }, this) }, void 0, false, {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 66,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "register", element: /* @__PURE__ */ jsxDEV(SignUp, {}, void 0, false, {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 67,
        columnNumber: 43
      }, this) }, void 0, false, {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 67,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
      lineNumber: 57,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(
      Route,
      {
        path: ROUTES.protected.dashboard,
        element: protectedShell(/* @__PURE__ */ jsxDEV(Dashboard, {}, void 0, false, {
          fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
          lineNumber: 72,
          columnNumber: 35
        }, this), { permission: "dashboard:view", roles: ["ADMIN", "SELLER", "BUILDER", "AGENT", "OWNER"] }, { title: "Dashboard", subtitle: "Manage your properties, leads, and profile from one place." })
      },
      void 0,
      false,
      {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 70,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      Route,
      {
        path: ROUTES.protected.postProperty,
        element: protectedShell(/* @__PURE__ */ jsxDEV(PostProperty, {}, void 0, false, {
          fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
          lineNumber: 76,
          columnNumber: 35
        }, this), { permission: "property:create", roles: ["ADMIN", "SELLER", "BUILDER", "AGENT", "OWNER"] }, { title: "Create Property", subtitle: "Publish a listing and route it into moderation or workspace flows." })
      },
      void 0,
      false,
      {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 74,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      Route,
      {
        path: ROUTES.legacy.post,
        element: protectedShell(/* @__PURE__ */ jsxDEV(PostProperty, {}, void 0, false, {
          fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
          lineNumber: 80,
          columnNumber: 35
        }, this), { permission: "property:create", roles: ["ADMIN", "SELLER", "BUILDER", "AGENT", "OWNER"] }, { title: "Create Property", subtitle: "Legacy alias for the property posting flow." })
      },
      void 0,
      false,
      {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 78,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      Route,
      {
        path: ROUTES.protected.editProperty,
        element: protectedShell(/* @__PURE__ */ jsxDEV(EditProperty, {}, void 0, false, {
          fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
          lineNumber: 84,
          columnNumber: 35
        }, this), { permission: "property:update", roles: ["ADMIN", "SELLER", "BUILDER", "AGENT", "OWNER"] }, { title: "Edit Property", subtitle: "Update a listing and re-submit it with the latest details." })
      },
      void 0,
      false,
      {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 82,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      Route,
      {
        path: ROUTES.protected.saved,
        element: protectedShell(/* @__PURE__ */ jsxDEV(Saved, {}, void 0, false, {
          fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
          lineNumber: 88,
          columnNumber: 35
        }, this), { permission: "saved:view", roles: ["ADMIN", "SELLER", "BUILDER", "AGENT", "OWNER"] }, { title: "Saved Properties", subtitle: "Review shortlisted listings and continue comparing or contacting owners." })
      },
      void 0,
      false,
      {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 86,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      Route,
      {
        path: ROUTES.protected.workspace,
        element: protectedShell(/* @__PURE__ */ jsxDEV(WorkspaceDashboard, {}, void 0, false, {
          fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
          lineNumber: 92,
          columnNumber: 35
        }, this), { permission: "workspace:view", roles: ["ADMIN", "SELLER", "BUILDER"] }, { title: "Workspace", subtitle: "A modular control panel for portfolio, leads, billing, and access." })
      },
      void 0,
      false,
      {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 90,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      Route,
      {
        path: ROUTES.protected.workspaceProperties,
        element: protectedShell(/* @__PURE__ */ jsxDEV(WorkspaceProperties, {}, void 0, false, {
          fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
          lineNumber: 96,
          columnNumber: 35
        }, this), { permission: "property:list", roles: ["ADMIN", "SELLER", "BUILDER"] }, { title: "Workspace Properties", subtitle: "Manage properties attached to the current workspace account." })
      },
      void 0,
      false,
      {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 94,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      Route,
      {
        path: ROUTES.protected.admin,
        element: protectedShell(/* @__PURE__ */ jsxDEV(AdminIndex, {}, void 0, false, {
          fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
          lineNumber: 100,
          columnNumber: 35
        }, this), { permission: "property:moderate", roles: ["ADMIN"] }, { title: "Admin Review", subtitle: "Approve or reject pending listings before they go live." })
      },
      void 0,
      false,
      {
        fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
        lineNumber: 98,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(Route, { path: "*", element: /* @__PURE__ */ jsxDEV(Navigate, { to: "/real-estate", replace: true }, void 0, false, {
      fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
      lineNumber: 103,
      columnNumber: 34
    }, this) }, void 0, false, {
      fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
      lineNumber: 103,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
    lineNumber: 56,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx",
    lineNumber: 55,
    columnNumber: 5
  }, this);
}
_s(RealEstateApp, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = RealEstateApp;
var _c;
$RefreshReg$(_c, "RealEstateApp");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("E:/DOLTEC/FRONTEND/src/real-estate/RealEstateApp.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,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RW5PO0FBQUEsTUFBQztBQUFBO0FBQUEsUUFDQyxNQUFNNUIsT0FBT3dCLFVBQVVXO0FBQUFBLFFBQ3ZCLFNBQVNyQixlQUFlLHVCQUFDLHlCQUFEO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFBb0IsR0FBSyxFQUFFWSxZQUFZLGlCQUFpQkMsT0FBTyxDQUFDLFNBQVMsVUFBVSxTQUFTLEVBQUUsR0FBRyxFQUFFTixPQUFPLHdCQUF3Qk8sVUFBVSwrREFBK0QsQ0FBQztBQUFBO0FBQUEsTUFGdE87QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBRXdPO0FBQUEsSUFFeE87QUFBQSxNQUFDO0FBQUE7QUFBQSxRQUNDLE1BQU01QixPQUFPd0IsVUFBVVk7QUFBQUEsUUFDdkIsU0FBU3RCLGVBQWUsdUJBQUMsZ0JBQUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQUFXLEdBQUssRUFBRVksWUFBWSxxQkFBcUJDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFTixPQUFPLGdCQUFnQk8sVUFBVSwwREFBMEQsQ0FBQztBQUFBO0FBQUEsTUFGL0w7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBRWlNO0FBQUEsSUFHak0sdUJBQUMsU0FBTSxNQUFLLEtBQUksU0FBUyx1QkFBQyxZQUFTLElBQUcsZ0JBQWUsU0FBTyxRQUFuQztBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQW1DLEtBQTVEO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBZ0U7QUFBQSxPQS9DbEU7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQWdEQSxLQWpERjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBa0RBO0FBRUo7QUFBQ1QsR0ExRHVCRCxlQUFhO0FBQUFtQixLQUFibkI7QUFBYSxJQUFBbUI7QUFBQUMsYUFBQUQsSUFBQSIsIm5hbWVzIjpbIlJlYWN0IiwidXNlRWZmZWN0IiwiTmF2aWdhdGUiLCJSb3V0ZSIsIlJvdXRlcyIsIlJlYWxFc3RhdGVMYXlvdXQiLCJEYXNoYm9hcmRMYXlvdXQiLCJQcm90ZWN0ZWRSb3V0ZSIsIlJPVVRFUyIsIkhvbWUiLCJMaXN0aW5nIiwiUHJvcGVydHlEZXRhaWwiLCJTaWduSW4iLCJTaWduVXAiLCJEYXNoYm9hcmQiLCJQb3N0UHJvcGVydHkiLCJFZGl0UHJvcGVydHkiLCJTYXZlZCIsIkNvbXBhcmUiLCJXb3Jrc3BhY2VEYXNoYm9hcmQiLCJXb3Jrc3BhY2VQcm9wZXJ0aWVzIiwiQWRtaW5JbmRleCIsInByb3RlY3RlZFNoZWxsIiwicGFnZSIsInJvdXRlIiwibGF5b3V0UHJvcHMiLCJSZWFsRXN0YXRlQXBwIiwiX3MiLCJkb2N1bWVudCIsInRpdGxlIiwibWluSGVpZ2h0IiwiY29sb3IiLCJwcm90ZWN0ZWQiLCJkYXNoYm9hcmQiLCJwZXJtaXNzaW9uIiwicm9sZXMiLCJzdWJ0aXRsZSIsInBvc3RQcm9wZXJ0eSIsImxlZ2FjeSIsInBvc3QiLCJlZGl0UHJvcGVydHkiLCJzYXZlZCIsIndvcmtzcGFjZSIsIndvcmtzcGFjZVByb3BlcnRpZXMiLCJhZG1pbiIsIl9jIiwiJFJlZnJlc2hSZWckIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbIlJlYWxFc3RhdGVBcHAuanN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IE5hdmlnYXRlLCBSb3V0ZSwgUm91dGVzIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XHJcbmltcG9ydCAnLi9yZS5jc3MnO1xyXG5cclxuaW1wb3J0IFJlYWxFc3RhdGVMYXlvdXQgZnJvbSAnLi9sYXlvdXRzL1JlYWxFc3RhdGVMYXlvdXQnO1xyXG5pbXBvcnQgRGFzaGJvYXJkTGF5b3V0IGZyb20gJy4vbGF5b3V0cy9EYXNoYm9hcmRMYXlvdXQnO1xyXG5pbXBvcnQgUHJvdGVjdGVkUm91dGUgZnJvbSAnLi9jb21wb25lbnRzL3JvdXRpbmcvUHJvdGVjdGVkUm91dGUnO1xyXG5pbXBvcnQgeyBST1VURVMgfSBmcm9tICcuL2NvbmZpZy9uYXZpZ2F0aW9uJztcclxuXHJcbmltcG9ydCBIb21lIGZyb20gJy4vcGFnZXMvSG9tZVBhZ2UnO1xyXG5pbXBvcnQgTGlzdGluZyBmcm9tICcuL3BhZ2VzL0xpc3RpbmcnO1xyXG5pbXBvcnQgUHJvcGVydHlEZXRhaWwgZnJvbSAnLi9wYWdlcy9Qcm9wZXJ0eURldGFpbCc7XHJcbmltcG9ydCBTaWduSW4gZnJvbSAnLi9wYWdlcy9hdXRoL1NpZ25Jbic7XHJcbmltcG9ydCBTaWduVXAgZnJvbSAnLi9wYWdlcy9hdXRoL1NpZ25VcCc7XHJcbmltcG9ydCBEYXNoYm9hcmQgZnJvbSAnLi9wYWdlcy9EYXNoYm9hcmQnO1xyXG5pbXBvcnQgUG9zdFByb3BlcnR5IGZyb20gJy4vcGFnZXMvUG9zdFByb3BlcnR5JztcclxuaW1wb3J0IEVkaXRQcm9wZXJ0eSBmcm9tICcuL3BhZ2VzL0VkaXRQcm9wZXJ0eSc7XHJcbmltcG9ydCBTYXZlZCBmcm9tICcuL3BhZ2VzL1NhdmVkJztcclxuaW1wb3J0IENvbXBhcmUgZnJvbSAnLi9wYWdlcy9Db21wYXJlJztcclxuaW1wb3J0IFdvcmtzcGFjZURhc2hib2FyZCBmcm9tICcuL3BhZ2VzL1dvcmtzcGFjZS9Xb3Jrc3BhY2VEYXNoYm9hcmQnO1xyXG5pbXBvcnQgV29ya3NwYWNlUHJvcGVydGllcyBmcm9tICcuL3BhZ2VzL1dvcmtzcGFjZS9Xb3Jrc3BhY2VQcm9wZXJ0aWVzJztcclxuaW1wb3J0IEFkbWluSW5kZXggZnJvbSAnLi9wYWdlcy9BZG1pbi9JbmRleCc7XHJcblxyXG5jb25zdCBwcm90ZWN0ZWRTaGVsbCA9IChwYWdlLCByb3V0ZSwgbGF5b3V0UHJvcHMgPSB7fSkgPT4gKFxyXG4gIDxQcm90ZWN0ZWRSb3V0ZSByb3V0ZT17cm91dGV9PlxyXG4gICAgPERhc2hib2FyZExheW91dCB7Li4ubGF5b3V0UHJvcHN9PntwYWdlfTwvRGFzaGJvYXJkTGF5b3V0PlxyXG4gIDwvUHJvdGVjdGVkUm91dGU+XHJcbik7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBSZWFsRXN0YXRlQXBwKCkge1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBkb2N1bWVudC50aXRsZSA9ICdEb2x0ZWMgUHJvcGVydGllcyB8IFByZW1pdW0gUmVhbCBFc3RhdGUgTWFya2V0cGxhY2UgSW5kaWEnO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwicmUtcm9vdC1vdmVycmlkZVwiIHN0eWxlPXt7IG1pbkhlaWdodDogJzEwMHZoJywgY29sb3I6ICcjMGYxNzJhJyB9fT5cclxuICAgICAgPFJvdXRlcz5cclxuICAgICAgICA8Um91dGUgcGF0aD1cIi9cIiBlbGVtZW50PXs8UmVhbEVzdGF0ZUxheW91dCAvPn0+XHJcbiAgICAgICAgICA8Um91dGUgaW5kZXggZWxlbWVudD17PEhvbWUgLz59IC8+XHJcbiAgICAgICAgICA8Um91dGUgcGF0aD1cImxpc3RpbmdcIiBlbGVtZW50PXs8TGlzdGluZyAvPn0gLz5cclxuICAgICAgICAgIDxSb3V0ZSBwYXRoPVwicHJvcGVydGllc1wiIGVsZW1lbnQ9ezxMaXN0aW5nIC8+fSAvPlxyXG4gICAgICAgICAgPFJvdXRlIHBhdGg9XCJwcm9wZXJ0eS86c2x1Z1wiIGVsZW1lbnQ9ezxQcm9wZXJ0eURldGFpbCAvPn0gLz5cclxuICAgICAgICAgIDxSb3V0ZSBwYXRoPVwicHJvcGVydGllcy86c2x1Z1wiIGVsZW1lbnQ9ezxQcm9wZXJ0eURldGFpbCAvPn0gLz5cclxuICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiY29tcGFyZVwiIGVsZW1lbnQ9ezxDb21wYXJlIC8+fSAvPlxyXG4gICAgICAgICAgPFJvdXRlIHBhdGg9XCJhdXRoL2xvZ2luXCIgZWxlbWVudD17PFNpZ25JbiAvPn0gLz5cclxuICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiYXV0aC9zaWdudXBcIiBlbGVtZW50PXs8U2lnblVwIC8+fSAvPlxyXG4gICAgICAgICAgPFJvdXRlIHBhdGg9XCJsb2dpblwiIGVsZW1lbnQ9ezxTaWduSW4gLz59IC8+XHJcbiAgICAgICAgICA8Um91dGUgcGF0aD1cInJlZ2lzdGVyXCIgZWxlbWVudD17PFNpZ25VcCAvPn0gLz5cclxuICAgICAgICA8L1JvdXRlPlxyXG5cclxuICAgICAgICA8Um91dGVcclxuICAgICAgICAgIHBhdGg9e1JPVVRFUy5wcm90ZWN0ZWQuZGFzaGJvYXJkfVxyXG4gICAgICAgICAgZWxlbWVudD17cHJvdGVjdGVkU2hlbGwoPERhc2hib2FyZCAvPiwgeyBwZXJtaXNzaW9uOiAnZGFzaGJvYXJkOnZpZXcnLCByb2xlczogWydBRE1JTicsICdTRUxMRVInLCAnQlVJTERFUicsICdBR0VOVCcsICdPV05FUiddIH0sIHsgdGl0bGU6ICdEYXNoYm9hcmQnLCBzdWJ0aXRsZTogJ01hbmFnZSB5b3VyIHByb3BlcnRpZXMsIGxlYWRzLCBhbmQgcHJvZmlsZSBmcm9tIG9uZSBwbGFjZS4nIH0pfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICAgPFJvdXRlXHJcbiAgICAgICAgICBwYXRoPXtST1VURVMucHJvdGVjdGVkLnBvc3RQcm9wZXJ0eX1cclxuICAgICAgICAgIGVsZW1lbnQ9e3Byb3RlY3RlZFNoZWxsKDxQb3N0UHJvcGVydHkgLz4sIHsgcGVybWlzc2lvbjogJ3Byb3BlcnR5OmNyZWF0ZScsIHJvbGVzOiBbJ0FETUlOJywgJ1NFTExFUicsICdCVUlMREVSJywgJ0FHRU5UJywgJ09XTkVSJ10gfSwgeyB0aXRsZTogJ0NyZWF0ZSBQcm9wZXJ0eScsIHN1YnRpdGxlOiAnUHVibGlzaCBhIGxpc3RpbmcgYW5kIHJvdXRlIGl0IGludG8gbW9kZXJhdGlvbiBvciB3b3Jrc3BhY2UgZmxvd3MuJyB9KX1cclxuICAgICAgICAvPlxyXG4gICAgICAgIDxSb3V0ZVxyXG4gICAgICAgICAgcGF0aD17Uk9VVEVTLmxlZ2FjeS5wb3N0fVxyXG4gICAgICAgICAgZWxlbWVudD17cHJvdGVjdGVkU2hlbGwoPFBvc3RQcm9wZXJ0eSAvPiwgeyBwZXJtaXNzaW9uOiAncHJvcGVydHk6Y3JlYXRlJywgcm9sZXM6IFsnQURNSU4nLCAnU0VMTEVSJywgJ0JVSUxERVInLCAnQUdFTlQnLCAnT1dORVInXSB9LCB7IHRpdGxlOiAnQ3JlYXRlIFByb3BlcnR5Jywgc3VidGl0bGU6ICdMZWdhY3kgYWxpYXMgZm9yIHRoZSBwcm9wZXJ0eSBwb3N0aW5nIGZsb3cuJyB9KX1cclxuICAgICAgICAvPlxyXG4gICAgICAgIDxSb3V0ZVxyXG4gICAgICAgICAgcGF0aD17Uk9VVEVTLnByb3RlY3RlZC5lZGl0UHJvcGVydHl9XHJcbiAgICAgICAgICBlbGVtZW50PXtwcm90ZWN0ZWRTaGVsbCg8RWRpdFByb3BlcnR5IC8+LCB7IHBlcm1pc3Npb246ICdwcm9wZXJ0eTp1cGRhdGUnLCByb2xlczogWydBRE1JTicsICdTRUxMRVInLCAnQlVJTERFUicsICdBR0VOVCcsICdPV05FUiddIH0sIHsgdGl0bGU6ICdFZGl0IFByb3BlcnR5Jywgc3VidGl0bGU6ICdVcGRhdGUgYSBsaXN0aW5nIGFuZCByZS1zdWJtaXQgaXQgd2l0aCB0aGUgbGF0ZXN0IGRldGFpbHMuJyB9KX1cclxuICAgICAgICAvPlxyXG4gICAgICAgIDxSb3V0ZVxyXG4gICAgICAgICAgcGF0aD17Uk9VVEVTLnByb3RlY3RlZC5zYXZlZH1cclxuICAgICAgICAgIGVsZW1lbnQ9e3Byb3RlY3RlZFNoZWxsKDxTYXZlZCAvPiwgeyBwZXJtaXNzaW9uOiAnc2F2ZWQ6dmlldycsIHJvbGVzOiBbJ0FETUlOJywgJ1NFTExFUicsICdCVUlMREVSJywgJ0FHRU5UJywgJ09XTkVSJ10gfSwgeyB0aXRsZTogJ1NhdmVkIFByb3BlcnRpZXMnLCBzdWJ0aXRsZTogJ1JldmlldyBzaG9ydGxpc3RlZCBsaXN0aW5ncyBhbmQgY29udGludWUgY29tcGFyaW5nIG9yIGNvbnRhY3Rpbmcgb3duZXJzLicgfSl9XHJcbiAgICAgICAgLz5cclxuICAgICAgICA8Um91dGVcclxuICAgICAgICAgIHBhdGg9e1JPVVRFUy5wcm90ZWN0ZWQud29ya3NwYWNlfVxyXG4gICAgICAgICAgZWxlbWVudD17cHJvdGVjdGVkU2hlbGwoPFdvcmtzcGFjZURhc2hib2FyZCAvPiwgeyBwZXJtaXNzaW9uOiAnd29ya3NwYWNlOnZpZXcnLCByb2xlczogWydBRE1JTicsICdTRUxMRVInLCAnQlVJTERFUiddIH0sIHsgdGl0bGU6ICdXb3Jrc3BhY2UnLCBzdWJ0aXRsZTogJ0EgbW9kdWxhciBjb250cm9sIHBhbmVsIGZvciBwb3J0Zm9saW8sIGxlYWRzLCBiaWxsaW5nLCBhbmQgYWNjZXNzLicgfSl9XHJcbiAgICAgICAgLz5cclxuICAgICAgICA8Um91dGVcclxuICAgICAgICAgIHBhdGg9e1JPVVRFUy5wcm90ZWN0ZWQud29ya3NwYWNlUHJvcGVydGllc31cclxuICAgICAgICAgIGVsZW1lbnQ9e3Byb3RlY3RlZFNoZWxsKDxXb3Jrc3BhY2VQcm9wZXJ0aWVzIC8+LCB7IHBlcm1pc3Npb246ICdwcm9wZXJ0eTpsaXN0Jywgcm9sZXM6IFsnQURNSU4nLCAnU0VMTEVSJywgJ0JVSUxERVInXSB9LCB7IHRpdGxlOiAnV29ya3NwYWNlIFByb3BlcnRpZXMnLCBzdWJ0aXRsZTogJ01hbmFnZSBwcm9wZXJ0aWVzIGF0dGFjaGVkIHRvIHRoZSBjdXJyZW50IHdvcmtzcGFjZSBhY2NvdW50LicgfSl9XHJcbiAgICAgICAgLz5cclxuICAgICAgICA8Um91dGVcclxuICAgICAgICAgIHBhdGg9e1JPVVRFUy5wcm90ZWN0ZWQuYWRtaW59XHJcbiAgICAgICAgICBlbGVtZW50PXtwcm90ZWN0ZWRTaGVsbCg8QWRtaW5JbmRleCAvPiwgeyBwZXJtaXNzaW9uOiAncHJvcGVydHk6bW9kZXJhdGUnLCByb2xlczogWydBRE1JTiddIH0sIHsgdGl0bGU6ICdBZG1pbiBSZXZpZXcnLCBzdWJ0aXRsZTogJ0FwcHJvdmUgb3IgcmVqZWN0IHBlbmRpbmcgbGlzdGluZ3MgYmVmb3JlIHRoZXkgZ28gbGl2ZS4nIH0pfVxyXG4gICAgICAgIC8+XHJcblxyXG4gICAgICAgIDxSb3V0ZSBwYXRoPVwiKlwiIGVsZW1lbnQ9ezxOYXZpZ2F0ZSB0bz1cIi9yZWFsLWVzdGF0ZVwiIHJlcGxhY2UgLz59IC8+XHJcbiAgICAgIDwvUm91dGVzPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iXSwiZmlsZSI6IkU6L0RPTFRFQy9GUk9OVEVORC9zcmMvcmVhbC1lc3RhdGUvUmVhbEVzdGF0ZUFwcC5qc3gifQ==
