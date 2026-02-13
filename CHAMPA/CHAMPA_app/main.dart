import 'package:flutter/material.dart';

void main() => runApp(const ChampaApp());

class ChampaApp extends StatelessWidget {
  const ChampaApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CHAMPA',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xFFD4AF37),
        scaffoldBackgroundColor: const Color(0xFF1A0000),
      ),
      home: const Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('CHAMPA', 
                style: TextStyle(fontSize: 60, color: Color(0xFFD4AF37), fontWeight: FontWeight.bold, letterSpacing: 5)),
              SizedBox(height: 20),
              Text('Rise Again', style: TextStyle(fontSize: 24, color: Colors.white70)),
              SizedBox(height: 50),
              CircularProgressIndicator(color: Color(0xFFD4AF37)),
            ],
          ),
        ),
      ),
    );
  }
}