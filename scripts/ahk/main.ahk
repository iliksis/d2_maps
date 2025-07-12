#Requires AutoHotkey v2.0
#include Gdip_all.ahk
#Include LLMouse.ahk

F3::
{
    global scPath := ""
    global sens := 4

    if !FileExist("ahk.ini") {
        MsgBox("No ahk.ini found, please create one.")
        ExitApp 10
    } else {
        scPath := IniRead("./ahk.ini", "Variables", "ScreenshotPath")
        sens := IniRead("./ahk.ini", "Variables", "Sensitivity")
    }

    run()
}

run() {
    y := 30000 / 6 / sens

    rotate(6)
    LLMouse.Move(0, y)
    rotate(7)
    LLMouse.Move(0, y * -2)
    rotate(7)
}

rotate(num := 6) {
    circle := 328000
    x := circle / num / 6 / sens
    loop num {
        LLMouse.Move(x, 0)
        screenshot()
        Sleep 1000
    }
}

screenshot() {
    Area := {
        X: 0,
        Y: 0,
        W: A_ScreenWidth,
        H: A_ScreenHeight
    }
    FilePath := scPath
    if !DirExist(FilePath) {
        DirCreate(FilePath)
    }
    FileName := FormatTime(, 'yyyy_MM_dd @ HH_mm_ss') '.png'
    GDIp.Startup()
    pBitmap := GDIp.BitmapFromScreen(Area)
    GDIp.SaveBitmapToFile(pBitmap, FilePath . FileName)
    GDIp.DisposeImage(pBitmap)
    GDIp.Shutdown()
}
