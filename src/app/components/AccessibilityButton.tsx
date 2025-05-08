"use client"

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  Type, 
  Contrast, 
  MousePointer, 
  Eye, 
  Link, 
  Image as ImageIcon,
  BoldIcon,
  FileText,
  ActivitySquare
} from "lucide-react";
import { CustomSheet, CustomSheetContent, CustomSheetTitle } from "@/components/ui/custom-sheet";
import { Card, CardContent } from "@/components/ui/card";
import { SwitchToggle } from "@/components/ui/switch-toggle";
import { useAccessibility } from "@/lib/accessibility-context";

const AccessibilityButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    fontSize, setFontSize,
    cursorSize, setCursorSize,
    highContrast, setHighContrast,
    grayscale, setGrayscale,
    hideImages, setHideImages,
    highlightLinks, setHighlightLinks,
    boldText, setBoldText,
    dyslexiaFont, setDyslexiaFont,
    reduceMotion, setReduceMotion
  } = useAccessibility();

  return (
    <>
      {!isOpen && (
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-20 right-6 z-[9999] h-14 w-14 rounded-full shadow-lg bg-[#F06292] hover:bg-[#EC407A] transition-all p-0 overflow-hidden accessibility-button"
          onClick={() => setIsOpen(true)}
          aria-label="Aksesibilitas"
        >
          <Image 
            src="/icons/accessibility.png" 
            alt="Aksesibilitas" 
            width={36} 
            height={36}
            className="object-contain"
          />
        </Button>
      )}

      <CustomSheet open={isOpen} onOpenChange={setIsOpen}>
        <CustomSheetContent 
          side="right" 
          className="!inset-y-0 rounded-xl w-[90%] sm:w-[40%] md:max-w-[750px] mr-4 overflow-hidden flex flex-col"
        >
          <CustomSheetTitle className="sr-only">Fitur Aksesibilitas</CustomSheetTitle>
          <div className="py-8 px-6 space-y-6 flex-grow overflow-auto">
            <div className="flex justify-between items-center border-b pb-8">
              <h2 className="text-xl font-bold">Fitur Aksesibilitas</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                aria-label="Tutup"
                onClick={() => setIsOpen(false)}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              </Button>
            </div>

            <div className="pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="shadow-sm border-0 bg-transparent">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Type className="h-5 w-5 text-[#FFCB57]" />
                        <span className="text-lg font-medium">Ukuran Teks</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 mb-3">
                      Sesuaikan ukuran teks untuk kenyamanan membaca.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant={fontSize === "small" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setFontSize("small")}
                        className="h-9 w-9 rounded-md"
                      >
                        A-
                      </Button>
                      <Button 
                        variant={fontSize === "normal" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setFontSize("normal")}
                        className="h-9 w-9 rounded-md"
                      >
                        A
                      </Button>
                      <Button 
                        variant={fontSize === "large" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setFontSize("large")}
                        className="h-9 w-9 rounded-md"
                      >
                        A+
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-0 bg-transparent">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <MousePointer className="h-5 w-5 text-[#FFCB57]" />
                        <span className="text-lg font-medium">Ukuran Kursor</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 mb-3">
                      Ubah ukuran kursor untuk visibilitas lebih baik.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant={cursorSize === "small" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setCursorSize("small")}
                        className="h-9 rounded-md min-w-[70px]"
                      >
                        Kecil
                      </Button>
                      <Button 
                        variant={cursorSize === "normal" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setCursorSize("normal")}
                        className="h-9 rounded-md min-w-[70px]"
                      >
                        Normal
                      </Button>
                      <Button 
                        variant={cursorSize === "large" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setCursorSize("large")}
                        className="h-9 rounded-md min-w-[70px]"
                      >
                        Besar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm border-0 bg-transparent">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Contrast className="h-5 w-5 text-[#FFCB57]" />
                        <span className="text-lg font-medium">Kontras Tinggi</span>
                      </div>
                      <SwitchToggle 
                        checked={highContrast} 
                        onCheckedChange={setHighContrast} 
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Tingkatkan kontras warna untuk keterbacaan lebih baik.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-0 bg-transparent">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Eye className="h-5 w-5 text-[#FFCB57]" />
                        <span className="text-lg font-medium">Skala Abu-abu</span>
                      </div>
                      <SwitchToggle 
                        checked={grayscale} 
                        onCheckedChange={setGrayscale} 
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Ubah tampilan menjadi hitam-putih untuk mengurangi distraksi.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-0 bg-transparent">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <ImageIcon className="h-5 w-5 text-[#FFCB57]" />
                        <span className="text-lg font-medium">Sembunyikan Gambar</span>
                      </div>
                      <SwitchToggle 
                        checked={hideImages} 
                        onCheckedChange={setHideImages} 
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Sembunyikan gambar untuk fokus pada konten teks.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-0 bg-transparent">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Link className="h-5 w-5 text-[#FFCB57]" />
                        <span className="text-lg font-medium">Sorot Tautan</span>
                      </div>
                      <SwitchToggle 
                        checked={highlightLinks} 
                        onCheckedChange={setHighlightLinks} 
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Sorot semua tautan untuk memudahkan identifikasi.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-0 bg-transparent">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <BoldIcon className="h-5 w-5 text-[#FFCB57]" />
                        <span className="text-lg font-medium">Teks Tebal</span>
                      </div>
                      <SwitchToggle 
                        checked={boldText} 
                        onCheckedChange={setBoldText} 
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Ubah semua teks menjadi tebal untuk meningkatkan keterbacaan.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-0 bg-transparent">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-[#FFCB57]" />
                        <span className="text-lg font-medium">Font Dyslexia</span>
                      </div>
                      <SwitchToggle 
                        checked={dyslexiaFont} 
                        onCheckedChange={setDyslexiaFont} 
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Gunakan font khusus yang lebih mudah dibaca untuk dyslexia.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-0 bg-transparent">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <ActivitySquare className="h-5 w-5 text-[#FFCB57]" />
                        <span className="text-lg font-medium">Kurangi Gerakan</span>
                      </div>
                      <SwitchToggle 
                        checked={reduceMotion} 
                        onCheckedChange={setReduceMotion} 
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Kurangi atau hilangkan animasi untuk mencegah disorientasi.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CustomSheetContent>
      </CustomSheet>
    </>
  );
};

export default AccessibilityButton; 