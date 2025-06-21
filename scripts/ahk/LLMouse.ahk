; =======================================================================================
; LLMouse - A library to send Low Level Mouse input

; Note that many functions have time and rate parameters.
; These all work the same way:
; times	- How many times to send the requested action. Optional, default is 1
; rate	- The rate (in ms) to send the action at. Optional, default rate varies
; Note that if you use a value for rate of less than 10, special code will kick in.
; QPX is used for rates of <10ms as the AHK Sleep command does not support sleeps this short
; More CPU will be used in this mode.
class LLMouse {
	static MOUSEEVENTF_MOVE := 0x1, MOUSEEVENTF_WHEEL := 0x800, WHEEL_DELTA := 120,
		LIMIT := SubStr(A_OSVersion, 1, InStr(A_OSVersion, '.')) < 8 ? 10 : 15

	; ======================= Functions for the user to call ============================
	; Move the mouse
	; All values are Signed Integers (Whole numbers, Positive or Negative)
	; x		- How much to move in the x axis. + is right, - is left
	; y		- How much to move in the y axis. + is down, - is up
	static Move(x, y, times := 1, rate := 1) => this._MouseEvent(times, rate, this.MOUSEEVENTF_MOVE, x, y)

	; Move the wheel
	; dir	- Which direction to move the wheel. 1 is up, -1 is down
	static Wheel(dir, times := 1, rate := 10) => this._MouseEvent(times, rate, this.MOUSEEVENTF_WHEEL, , , dir * this.WHEEL_DELTA
	)

	; ============ Internal functions not intended to be called by end-users ============
	static _MouseEvent(times, rate, dwFlags := 0, dx := 0, dy := 0, dwData := 0) {
		DelayFN := (rate < this.LIMIT) ? this._Delay.Bind(rate) : Sleep.Bind(rate)
		while times {
			DllCall("mouse_event", "uint", dwFlags, "int", dx, "int", dy, "uint", dwData, "int", 0)
			if (times -= 1) ; Do not delay after last send, or if rate is 0
				DelayFN
		}
	}

	static _Delay(D := 1) ; High Resolution Delay ( High CPU Usage ) by SKAN | CD: 13/Jun/2009
	{
		; www.autohotkey.com/forum/viewtopic.php?t=52083 | LM: 13/Jun/2009
		static F := (DllCall("QueryPerformanceFrequency", "Int64P", &F := 0), F // 1000)
		Critical
		DllCall("QueryPerformanceCounter", "Int64P", &cTick := 0), pTick := cTick
		; While (Tick := (pTick - cTick) // F) < D
		while ((pTick - cTick) // F) < D
			DllCall("QueryPerformanceCounter", "Int64P", &pTick := 0), Sleep(-1)
		; Return Round( Tick,3 )
	}
}
