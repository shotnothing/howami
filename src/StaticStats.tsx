import { useState, useEffect } from 'react'
import { getGPUTier } from 'detect-gpu';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

declare global {
  interface Navigator {
    bluetooth?: any;
    connection?: any;
    contacts?: any;
    deviceMemory?: any;
    gpu?: any;
    hardwareConcurrency?: any;
    hid?: any;
    keyboard?: any;
    language?: any;
    languages?: any;
    locks?: any;
    login?: any;
    onLine?: any;
    pdfViewerEnabled?: any;
    presentation?: any;
    scheduling?: any;
    serial?: any;
    storage?: any;
    usb?: any;
    userAgent?: any;
    userAgentData?: any;
    virtualKeyboard?: any;
    webdriver?: any;
    windowControlsOverlay?: any;
  }
}

function StaticStats() {
  const [stats, setStats] = useState<Record<string, Record<string, any>>>({
    "categoryTest": { "keyTest": "valueTest" },
  });

  useEffect(() => {
    const getWebGLStats = () => {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") as WebGLRenderingContext || canvas.getContext("experimental-webgl") as WebGLRenderingContext;

      if (!gl) {
        return [{ category: "webgl", key: "supported", value: "false" }];
      }

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

      return {
        "vendor": gl.getParameter(gl.VENDOR),
        "renderer": gl.getParameter(gl.RENDERER),
        "unmaskedVendor": debugInfo ? debugInfo.UNMASKED_VENDOR_WEBGL : null,
        "unmaskedRenderer": debugInfo ? debugInfo.UNMASKED_RENDERER_WEBGL : null,
        "maxVertexAttributes": gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
        "maxVertexUniformVectors": gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
        "maxVertexTextureImageUnits": gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
        "maxVaryingVectors": gl.getParameter(gl.MAX_VARYING_VECTORS),
        "aliasedLineWidthRange": gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE),
        "aliasedPointSizeRange": gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE),
        "maxFragmentUniformVectors": gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
        "maxTextureSize": gl.getParameter(gl.MAX_TEXTURE_SIZE),
        "maxRenderBufferSize": gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
      };
    };

    const getNavigatorStats = () => {
      return {
        "bluetooth": navigator.bluetooth ? "true" : "false",
        "clipboard": navigator.clipboard ? "true" : "false",
        "connection": navigator.connection ? "true" : "false",
        "contacts": navigator.contacts ? "true" : "false",
        "cookieEnabled": navigator.cookieEnabled,
        "credentials": navigator.credentials ? "true" : "false",
        "deviceMemory (bins of 1,2,4,8, rounded down)": navigator.deviceMemory,
        "geolocation": navigator.geolocation ? "true" : "false",
        "gpu": navigator.gpu ? "true" : "false",
        "hardwareConcurrency": navigator.hardwareConcurrency,
        "hid": navigator.hid ? "true" : "false",
        "keyboard": navigator.keyboard ? "true" : "false",
        "language": navigator.language,
        "languages": navigator.languages,
        "locks": navigator.locks ? "true" : "false",
        "login": navigator.login,
        "maxTouchPoints": navigator.maxTouchPoints,
        "mediaCapabilities": navigator.mediaCapabilities,
        "mediaDevices": navigator.mediaDevices ? "true" : "false",
        "mediaSession": navigator.mediaSession ? "true" : "false",
        "onLine": navigator.onLine,
        "pdfViewerEnabled": navigator.pdfViewerEnabled,
        "permissions": navigator.permissions ? "true" : "false",
        "presentation": navigator.presentation ? "true" : "false",
        "scheduling": navigator.scheduling ? "true" : "false",
        "serial": navigator.serial ? "true" : "false",
        "serviceWorker": navigator.serviceWorker,
        "storage": navigator.storage ? "true" : "false",
        "usb": navigator.usb ? "true" : "false",
        "userActivation": navigator.userActivation,
        "userAgent": navigator.userAgent,
        "userAgentData": navigator.userAgentData,
        "virtualKeyboard": navigator.virtualKeyboard ? "true" : "false",
        "wakeLock": navigator.wakeLock ? "true" : "false",
        "webdriver": navigator.webdriver ? "true" : "false",
        "windowControlsOverlay": navigator.windowControlsOverlay,
      }
    }

    async function getDetectGPUStats() {
      const gpuTier = await getGPUTier();
      return {
        gpu: gpuTier.gpu,
        fps: gpuTier.fps,
        tier: gpuTier.tier,
        isMobile: gpuTier.isMobile,
      }
    }

    

    getDetectGPUStats().then((detectGPUStats) => {
      setStats({
        "navigator": getNavigatorStats(),
        "webgl": {
          ...getWebGLStats(),
        },
        "detect-gpu": detectGPUStats,
      })
    })

  }, [])

  // Columns: Category, Key, Value
  const columns = [
    {
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Key",
      accessorKey: "key",
    },
    {
      header: "Value",
      accessorKey: "value",
    },
  ]

  const data = Object.entries(stats).map(([category, keyValue]) => {
    return Object.entries(keyValue).map(([key, value]) => ({
      category, key, value: JSON.stringify(value)
    }))
  }).flat();

  console.log(data);

  return (
    <>
      <DataTable columns={columns} data={data} />
    </>
  )
}

export default StaticStats