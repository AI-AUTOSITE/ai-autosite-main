// app/automation/api/apply/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

// 型定義
interface ApplicationData {
  name: string
  email: string
  business: string
  website?: string
  message: string
  timestamp?: string
  status?: string
}

// メール送信関数（オプション - SendGrid使用例）
async function sendNotificationEmail(data: ApplicationData) {
  // SendGrid実装例（環境変数にAPI KEYが必要）
  if (process.env.SENDGRID_API_KEY && process.env.NOTIFICATION_EMAIL) {
    try {
      // const sgMail = require('@sendgrid/mail')
      // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      
      const emailContent = {
        to: process.env.NOTIFICATION_EMAIL,
        from: 'noreply@ai-autosite.com',
        subject: `New Automation Application: ${data.business}`,
        html: `
          <h2>New First 5 Clients Application</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Business:</strong> ${data.business}</p>
          <p><strong>Website:</strong> ${data.website || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message}</p>
          <hr>
          <p>Submitted at: ${new Date().toISOString()}</p>
        `
      }
      
      // await sgMail.send(emailContent)
      console.log('Email notification would be sent:', emailContent)
    } catch (error) {
      console.error('Email send error:', error)
    }
  }
}

// POSTリクエスト処理
export async function POST(request: NextRequest) {
  try {
    // リクエストボディを取得
    const data: ApplicationData = await request.json()
    
    // バリデーション
    if (!data.name || !data.email || !data.business || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // メールフォーマットの簡易チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    // アプリケーションIDを生成
    const applicationId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // データに追加情報を付与
    const applicationData: ApplicationData = {
      ...data,
      timestamp: new Date().toISOString(),
      status: 'pending'
    }
    
    // Vercel KVに保存（利用可能な場合）
    try {
      await kv.set(applicationId, applicationData)
      
      // 残りスポット数を取得・更新
      const spotsKey = 'first_5_spots'
      let spots = await kv.get<number>(spotsKey) || 5
      
      if (spots > 0) {
        spots = spots - 1
        await kv.set(spotsKey, spots)
      }
      
      // スポット履歴も保存
      const historyKey = `application_history_${new Date().getFullYear()}_${new Date().getMonth() + 1}`
      const history = await kv.get<string[]>(historyKey) || []
      history.push(applicationId)
      await kv.set(historyKey, history)
      
    } catch (kvError) {
      // KVが利用できない場合はコンソールに出力
      console.log('KV storage not available, logging to console:', applicationData)
    }
    
    // メール通知を送信
    await sendNotificationEmail(applicationData)
    
    // 成功レスポンス
    return NextResponse.json({
      success: true,
      applicationId,
      message: 'Application received successfully',
      spotsRemaining: (await kv.get<number>('first_5_spots')) || 4
    })
    
  } catch (error) {
    console.error('Application processing error:', error)
    
    // エラーレスポンス
    return NextResponse.json(
      { 
        error: 'Failed to process application',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GETリクエスト処理（残りスポット数の確認用）
export async function GET(request: NextRequest) {
  try {
    const spots = await kv.get<number>('first_5_spots') || 5
    
    return NextResponse.json({
      spotsRemaining: spots,
      specialPrice: 2800,
      regularPrice: 4500,
      savings: 1700,
      percentOff: 38
    })
    
  } catch (error) {
    // KVが利用できない場合はデフォルト値を返す
    return NextResponse.json({
      spotsRemaining: 5,
      specialPrice: 2800,
      regularPrice: 4500,
      savings: 1700,
      percentOff: 38
    })
  }
}