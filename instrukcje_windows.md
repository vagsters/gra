# Jak Uruchomić Grę na Systemie Windows

Witaj! Ta instrukcja pokaże Ci, jak w najprostszy sposób uruchomić grę na Twoim komputerze.

---

## Metoda Najprostsza (Zalecana): Plik `uruchom_gre.bat`

Aby maksymalnie ułatwić uruchamianie gry, przygotowałem specjalny plik, który wszystko zrobi za Ciebie.

**Krok 1: Uruchom Plik `uruchom_gre.bat`**

*   W folderze z grą znajdź plik o nazwie `uruchom_gre.bat`.
*   Kliknij go **dwukrotnie**, aby go uruchomić.

**Krok 2: Ostrzeżenie Bezpieczeństwa (Może się pojawić)**

*   System Windows może wyświetlić niebieskie okno "System Windows chronił ten komputer", ponieważ nie rozpoznaje tego pliku. **Jest to normalne i plik jest w 100% bezpieczny.**
*   Aby kontynuować:
    1.  Kliknij na napis **"Więcej informacji"**.
    2.  Pojawi się nowy przycisk – kliknij **"Uruchom mimo to"**.

**Krok 3: Graj!**

*   Po chwili otworzy się czarne okno terminala (konsoli), a zaraz po nim gra uruchomi się automatycznie w Twojej domyślnej przeglądarce.

**BARDZO WAŻNE:**
*   **Nie zamykaj czarnego okna konsoli!** Działa ono jako serwer dla gry. Musi być otwarte przez cały czas, gdy grasz.
*   Gdy skończysz grać, po prostu zamknij kartę z grą w przeglądarce, a następnie możesz zamknąć czarne okno konsoli.

---

## Co zrobić, jeśli to nie działa?

Jeśli po uruchomieniu pliku `uruchom_gre.bat` zobaczysz komunikat o braku Pythona, oznacza to, że musisz go zainstalować.

1.  Pobierz instalator Pythona z oficjalnej strony: **https://www.python.org/downloads/**
2.  Uruchom instalator. Na pierwszym ekranie **koniecznie zaznacz opcję "Add Python to PATH"** na dole okna.
3.  Przejdź przez resztę instalacji, a następnie ponownie uruchom plik `uruchom_gre.bat`.

---

## Metody Alternatywne (dla zaawansowanych)

Jeśli z jakiegoś powodu nie chcesz używać pliku `.bat`, możesz skorzystać z metod opisanych poniżej.

### 1. Ręczne Uruchomienie Serwera Python

*   **Otwórz Terminal:** Przytrzymaj `Shift` i kliknij prawym przyciskiem myszy w folderze z grą, a następnie wybierz "Otwórz okno programu PowerShell tutaj".
*   **Wpisz Komendę:** Wpisz `python -m http.server` i naciśnij Enter.
*   **Otwórz Grę:** W przeglądarce wejdź na adres `http://localhost:8000`.

### 2. Rozszerzenie do Przeglądarki

*   Zainstaluj rozszerzenie takie jak **"Live Server"** dla Visual Studio Code lub **"Web Server for Chrome"**.
*   Skonfiguruj rozszerzenie, aby wskazywało na folder z grą, i uruchom serwer.
