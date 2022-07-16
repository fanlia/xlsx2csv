
from openpyxl import Workbook

wb = Workbook()

sh = wb.active

sh.append(['id', 'A', 'B', 'C', 'D'])

for i in range(1000000):
    sh.append([i+1, 90, 100, 95, 99])

wb.save('big.xlsx')
