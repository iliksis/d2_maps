;GDIp Class - Select GDIp library functions converted to a class specifically for this script
#DllLoad 'GdiPlus'
class GDIp {
	;{ Startup
	static Startup() {
		if (this.HasProp("Token"))
			return
		input := Buffer((A_PtrSize = 8) ? 24 : 16, 0)
		NumPut("UInt", 1, input)
		DllCall("gdiplus\GdiplusStartup", "UPtr*", &pToken := 0, "UPtr", input.ptr, "UPtr", 0)
		this.Token := pToken
	}
	;}
	;{ Shutdown
	static Shutdown() {
		if (this.HasProp("Token"))
			DllCall("Gdiplus\GdiplusShutdown", "UPtr", this.DeleteProp("Token"))
	}
	;}
	;{ BitmapFromScreen
	static BitmapFromScreen(Area) {
		chdc := this.CreateCompatibleDC()
		hbm := this.CreateDIBSection(Area.W, Area.H, chdc)
		obm := this.SelectObject(chdc, hbm)
		hhdc := this.GetDC()
		this.BitBlt(chdc, 0, 0, Area.W, Area.H, hhdc, Area.X, Area.Y)
		this.ReleaseDC(hhdc)
		pBitmap := this.CreateBitmapFromHBITMAP(hbm)
		this.SelectObject(chdc, obm), this.DeleteObject(hbm), this.DeleteDC(hhdc), this.DeleteDC(chdc)
		return pBitmap
	}
	;}
	;{ CreateCompatibleDC
	static CreateCompatibleDC(hdc := 0) {
		return DllCall("CreateCompatibleDC", "UPtr", hdc)
	}
	;}
	;{ CreateDIBSection
	static CreateDIBSection(w, h, hdc := "", bpp := 32, &ppvBits := 0, Usage := 0, hSection := 0, Offset := 0) {
		hdc2 := hdc ? hdc : this.GetDC()
		bi := Buffer(40, 0)
		NumPut("UInt", 40, bi, 0)
		NumPut("UInt", w, bi, 4)
		NumPut("UInt", h, bi, 8)
		NumPut("UShort", 1, bi, 12)
		NumPut("UShort", bpp, bi, 14)
		NumPut("UInt", 0, bi, 16)

		hbm := DllCall("CreateDIBSection"
			, "UPtr", hdc2
			, "UPtr", bi.ptr    ; BITMAPINFO
			, "uint", Usage
			, "UPtr*", &ppvBits
			, "UPtr", hSection
			, "uint", Offset, "UPtr")

		if !hdc
			this.ReleaseDC(hdc2)
		return hbm
	}
	;}
	;{ SelectObject
	static SelectObject(hdc, hgdiobj) {
		return DllCall("SelectObject", "UPtr", hdc, "UPtr", hgdiobj)
	}
	;}
	;{ BitBlt
	static BitBlt(ddc, dx, dy, dw, dh, sdc, sx, sy, raster := "") {
		return DllCall("gdi32\BitBlt"
			, "UPtr", ddc
			, "int", dx, "int", dy
			, "int", dw, "int", dh
			, "UPtr", sdc
			, "int", sx, "int", sy
			, "uint", raster ? raster : 0x00CC0020)
	}
	;}
	;{ CreateBitmapFromHBITMAP
	static CreateBitmapFromHBITMAP(hBitmap, hPalette := 0) {
		DllCall("gdiplus\GdipCreateBitmapFromHBITMAP", "UPtr", hBitmap, "UPtr", hPalette, "UPtr*", &pBitmap := 0)
		return pBitmap
	}
	;}
	;{ CreateHBITMAPFromBitmap
	static CreateHBITMAPFromBitmap(pBitmap, Background := 0xffffffff) {
		DllCall("gdiplus\GdipCreateHBITMAPFromBitmap", "UPtr", pBitmap, "UPtr*", &hBitmap := 0, "int", Background)
		return hBitmap
	}
	;}
	;{ DeleteObject
	static DeleteObject(hObject) {
		return DllCall("DeleteObject", "UPtr", hObject)
	}
	;}
	;{ ReleaseDC
	static ReleaseDC(hdc, hwnd := 0) {
		return DllCall("ReleaseDC", "UPtr", hwnd, "UPtr", hdc)
	}
	;}
	;{ DeleteDC
	static DeleteDC(hdc) {
		return DllCall("DeleteDC", "UPtr", hdc)
	}
	;}
	;{ DisposeImage
	static DisposeImage(pBitmap, noErr := 0) {
		if (StrLen(pBitmap) <= 2 && noErr = 1)
			return 0

		r := DllCall("gdiplus\GdipDisposeImage", "UPtr", pBitmap)
		if (r = 2 || r = 1) && (noErr = 1)
			r := 0
		return r
	}
	;}
	;{ GetDC
	static GetDC(hwnd := 0) {
		return DllCall("GetDC", "UPtr", hwnd)
	}
	;}
	;{ GetDCEx
	static GetDCEx(hwnd, flags := 0, hrgnClip := 0) {
		return DllCall("GetDCEx", "UPtr", hwnd, "UPtr", hrgnClip, "int", flags)
	}
	;}
	;{ SaveBitmapToFile
	static SaveBitmapToFile(pBitmap, sOutput, Quality := 75, toBase64 := 0) {
		_p := 0

		SplitPath sOutput, , , &Extension
		if !RegExMatch(Extension, "^(?i:BMP|DIB|RLE|JPG|JPEG|JPE|JFIF|GIF|TIF|TIFF|PNG)$")
			return -1

		Extension := "." Extension
		DllCall("gdiplus\GdipGetImageEncodersSize", "uint*", &nCount := 0, "uint*", &nSize := 0)
		ci := Buffer(nSize)
		DllCall("gdiplus\GdipGetImageEncoders", "uint", nCount, "uint", nSize, "UPtr", ci.ptr)
		if !(nCount && nSize)
			return -2

		static IsUnicode := StrLen(Chr(0xFFFF))
		if (IsUnicode) {
			StrGet_Name := "StrGet"
			loop nCount {
				sString := %StrGet_Name%(NumGet(ci, (idx := (48 + 7 * A_PtrSize) * (A_Index - 1)) + 32 + 3 * A_PtrSize, "UPtr"),
				"UTF-16")
				if !InStr(sString, "*" Extension)
					continue

				pCodec := ci.ptr + idx
				break
			}
		} else {
			loop nCount {
				Location := NumGet(ci, 76 * (A_Index - 1) + 44, "UPtr")
				nSize := DllCall("WideCharToMultiByte", "uint", 0, "uint", 0, "uint", Location, "int", -1, "uint", 0, "int", 0,
					"uint", 0, "uint", 0)
				sString := Buffer(nSize)
				DllCall("WideCharToMultiByte", "uint", 0, "uint", 0, "uint", Location, "int", -1, "str", sString, "int", nSize,
					"uint", 0, "uint", 0)
				if !InStr(sString, "*" Extension)
					continue

				pCodec := ci.ptr + 76 * (A_Index - 1)
				break
			}
		}

		if !pCodec
			return -3

		if (Quality != 75) {
			Quality := (Quality < 0) ? 0 : (Quality > 100) ? 100 : Quality
			if (Quality > 90 && toBase64 = 1)
				Quality := 90

			if RegExMatch(Extension, "^\.(?i:JPG|JPEG|JPE|JFIF)$") {
				DllCall("gdiplus\GdipGetEncoderParameterListSize", "UPtr", pBitmap, "UPtr", pCodec, "uint*", &nSize)
				EncoderParameters := Buffer(nSize, 0)
				DllCall("gdiplus\GdipGetEncoderParameterList", "UPtr", pBitmap, "UPtr", pCodec, "uint", nSize, "UPtr",
					EncoderParameters.ptr)
				nCount := NumGet(EncoderParameters, "UInt")
				loop nCount {
					elem := (24 + A_PtrSize) * (A_Index - 1) + 4 + (pad := (A_PtrSize = 8) ? 4 : 0)
					if (NumGet(EncoderParameters, elem + 16, "UInt") = 1) && (NumGet(EncoderParameters, elem + 20, "UInt") = 6) {
						_p := elem + EncoderParameters.ptr - pad - 4
						NumPut(Quality, NumGet(NumPut(4, NumPut(1, _p + 0, "UPtr") + 20, "UInt"), "UPtr"), "UInt")
						break
					}
				}
			}
		}

		if (toBase64 = 1) {
			; part of the function extracted from ImagePut by iseahound
			; https://www.autohotkey.com/boards/viewtopic.php?f=6&t=76301&sid=bfb7c648736849c3c53f08ea6b0b1309
			DllCall("ole32\CreateStreamOnHGlobal", "UPtr", 0, "int", true, "UPtr*", &pStream := 0)
			_E := DllCall("gdiplus\GdipSaveImageToStream", "UPtr", pBitmap, "UPtr", pStream, "UPtr", pCodec, "uint", _p)
			if _E
				return -6

			DllCall("ole32\GetHGlobalFromStream", "UPtr", pStream, "uint*", &hData)
			pData := DllCall("GlobalLock", "UPtr", hData, "UPtr")
			nSize := DllCall("GlobalSize", "uint", pData)

			bin := Buffer(nSize, 0)
			DllCall("RtlMoveMemory", "UPtr", bin.ptr, "UPtr", pData, "uptr", nSize)
			DllCall("GlobalUnlock", "UPtr", hData)
			ObjRelease(pStream)
			DllCall("GlobalFree", "UPtr", hData)

			; Using CryptBinaryToStringA saves about 2MB in memory.
			DllCall("Crypt32.dll\CryptBinaryToStringA", "UPtr", bin.ptr, "uint", nSize, "uint", 0x40000001, "UPtr", 0, "uint*", &
				base64Length := 0)
			base64 := Buffer(base64Length, 0)
			_E := DllCall("Crypt32.dll\CryptBinaryToStringA", "UPtr", bin.ptr, "uint", nSize, "uint", 0x40000001, "UPtr", &
				base64, "uint*", base64Length)
			if !_E
				return -7

			bin := Buffer(0)
			return StrGet(base64, base64Length, "CP0")
		}

		_E := DllCall("gdiplus\GdipSaveImageToFile", "UPtr", pBitmap, "WStr", sOutput, "UPtr", pCodec, "uint", _p)
		return _E ? -5 : 0
	}
	;}
}
