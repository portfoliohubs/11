---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true

# معلومات الحالة
caseNumber: "{{ .Name }}"
category: "cosmetic"  # cosmetic, implant, orthodontic, whitening, root-canal, surgery
difficulty: "medium"  # easy, medium, hard, complex

# وصف الحالة
description: "وصف مختصر للحالة والعلاج المقدم"
problem: "المشكلة الأساسية التي كان يعاني منها المريض"
solution: "الحل والإجراءات العلاجية المتبعة"

# تفاصيل العلاج
treatment:
  duration: "3 أشهر"
  sessions: 6
  techniques:
    - "تقنية 1"
    - "تقنية 2"
  
# بيانات المريض (مجهولة)
patient:
  age: 30
  gender: "male"  # male, female
  concerns:
    - "القلق الأول"
    - "القلق الثاني"

# الصور (يجب وضعها في نفس المجلد)
images:
  before: "before.jpg"
  after: "after.jpg"
  # يمكن إضافة صور إضافية
  additional: []

# الوسوم
tags:
  - "تجميل"
  - "ابتسامة هوليود"

# الإظهار
featured: false  # لإظهار الحالة في الصفحة الرئيسية
weight: 0  # ترتيب الظهور (الأقل رقماً يظهر أولاً)

# SEO
seoTitle: ""
seoDescription: ""
---

## وصف الحالة

[اكتب هنا وصفاً تفصيلياً للحالة...]

## المشكلة

[اشرح المشكلة التي كان يعاني منها المريض...]

## العلاج

[اشرح خطوات العلاج والتقنيات المستخدمة...]

## النتيجة

[اشرح النتيجة النهائية ومدى رضا المريض...]