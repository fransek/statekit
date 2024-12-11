/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as TodoImport } from './routes/todo'
import { Route as CounterImport } from './routes/counter'
import { Route as ContextImport } from './routes/context'
import { Route as AsyncImport } from './routes/async'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const TodoRoute = TodoImport.update({
  id: '/todo',
  path: '/todo',
  getParentRoute: () => rootRoute,
} as any)

const CounterRoute = CounterImport.update({
  id: '/counter',
  path: '/counter',
  getParentRoute: () => rootRoute,
} as any)

const ContextRoute = ContextImport.update({
  id: '/context',
  path: '/context',
  getParentRoute: () => rootRoute,
} as any)

const AsyncRoute = AsyncImport.update({
  id: '/async',
  path: '/async',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/async': {
      id: '/async'
      path: '/async'
      fullPath: '/async'
      preLoaderRoute: typeof AsyncImport
      parentRoute: typeof rootRoute
    }
    '/context': {
      id: '/context'
      path: '/context'
      fullPath: '/context'
      preLoaderRoute: typeof ContextImport
      parentRoute: typeof rootRoute
    }
    '/counter': {
      id: '/counter'
      path: '/counter'
      fullPath: '/counter'
      preLoaderRoute: typeof CounterImport
      parentRoute: typeof rootRoute
    }
    '/todo': {
      id: '/todo'
      path: '/todo'
      fullPath: '/todo'
      preLoaderRoute: typeof TodoImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/async': typeof AsyncRoute
  '/context': typeof ContextRoute
  '/counter': typeof CounterRoute
  '/todo': typeof TodoRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/async': typeof AsyncRoute
  '/context': typeof ContextRoute
  '/counter': typeof CounterRoute
  '/todo': typeof TodoRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/async': typeof AsyncRoute
  '/context': typeof ContextRoute
  '/counter': typeof CounterRoute
  '/todo': typeof TodoRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/async' | '/context' | '/counter' | '/todo'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/async' | '/context' | '/counter' | '/todo'
  id: '__root__' | '/' | '/async' | '/context' | '/counter' | '/todo'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AsyncRoute: typeof AsyncRoute
  ContextRoute: typeof ContextRoute
  CounterRoute: typeof CounterRoute
  TodoRoute: typeof TodoRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AsyncRoute: AsyncRoute,
  ContextRoute: ContextRoute,
  CounterRoute: CounterRoute,
  TodoRoute: TodoRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/async",
        "/context",
        "/counter",
        "/todo"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/async": {
      "filePath": "async.tsx"
    },
    "/context": {
      "filePath": "context.tsx"
    },
    "/counter": {
      "filePath": "counter.tsx"
    },
    "/todo": {
      "filePath": "todo.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
